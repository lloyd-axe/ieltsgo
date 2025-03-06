import re
from django.shortcuts import render
from google import genai
from google.genai import types
import google.generativeai as genai1
from rest_framework.response import Response
from django.conf import settings
from .models import AIConfigs
from .serializers import AIConfigsSerializer

genai1.configure(api_key=settings.AI_API_KEY)
MODEL_TO_USE = "gemini-1"

def remove_numbered_pipes(text):
    return re.sub(r"\|\d+\|", "", text)


def fetch_model_configs():
    model_configs = AIConfigs.objects.filter(is_active=True).order_by("id").first()
    serializer = AIConfigsSerializer(model_configs)
    return serializer.data


def handle_unanswered_question(user_answers, correct_answers):
    if isinstance(list(user_answers.values())[0], dict):
        for n, correct in enumerate(correct_answers):
            user_answers[str(n)] = {
                str(m): user_answers.get(str(n), {}).get(str(m), None)
                for m in range(len(correct))
            }
            user_answers[str(n)] = list(user_answers[str(n)].values())
    elif isinstance(list(user_answers.values())[0], list):
        ans = {}
        for n in range(len(correct_answers)):
            ans[str(n)] = []
            for m in range(len(correct_answers[n])):
                ans[str(n)].append(None)

        for k, v in user_answers.items():
            for n in range(len(v)):
                ans[k][n] = v[n]

        user_answers = ans
    else:
        user_answers = {str(n): user_answers.get(str(n), None) for n in range(len(correct_answers))}
    return {k: user_answers[k] for k in sorted(user_answers)}


def validate_writing_answer_1(test_type, user_response, question):
    if user_response == "" or len(user_response.split(" ")) <= 50:
        return Response({"band_score": "/", 
                         "evaluation": "Looks like your answer is too short. This is not worth evaluating. Please try again.", 
                         "improve_version": "--- --- ---"})
    model_configs = fetch_model_configs()
    task_prompt = model_configs[f'task{test_type.split("_")[1]}_prompt']

    model = genai1.GenerativeModel(
        model_name=model_configs['model_name'],
        safety_settings=model_configs['safety_settings'],
        generation_config=model_configs['generation_config'],
        system_instruction=model_configs['system_prompt']
    )
    prompt_instructions = """
    Do not use any text formatting such as bold, italics, bullet points, or numbered lists. 
    Present all feedback as plain text in full sentences. Just add a "<br/><br/>" between paragraphs to represent a newline.
    Strictly use the following format when responding:
    My band score. No words, just a number | Evaluation of my answer | Revised version of my response

    Make sure to separate band score, evaluation, and improved version by the "|" character,
    because I am gonna do python: .split('|') in your response to make a list.
    Do not include the "{" and "}" characters when responding.
    """

    full_prompt = task_prompt + f"""
    Here is the task's prompt:
    {question}

    ---

    Here is the my answer:
    {user_response}

    ---
    """ + prompt_instructions

    try:
        response = model.generate_content(full_prompt)
        split_response = response.text.split('|')
        print(split_response)
        if len(split_response) != 3:
            raise Exception
        
        band_score = split_response[0].strip()
        evaluation = split_response[1].strip()
        improved_version = split_response[2].strip()
        return Response({"band_score": band_score, "evaluation": evaluation, "improve_version": improved_version})
    except Exception as e:
        print(f"An error occurred: {e}")
        error_response = "Ooops.. looks like the AI evaluator is not available at the moment. You may try again by refreshing the page."
        return Response({"band_score": 0, 
                         "evaluation": error_response, 
                         "improve_version": error_response})


def validate_writing_answer_2(test_type, user_response, question):
    ai_client = genai.Client(api_key=settings.AI_API_KEY)
    model_configs = fetch_model_configs()
    task_prompt = model_configs[f'task{test_type.split("_")[1]}_prompt']

    prompt_instructions = """
    Do not use any text formatting such as bold, italics, bullet points, or numbered lists. 
    Present all feedback as plain text in full sentences. Just add a "<br/><br/>" between paragraphs to represent a newline.
    Strictly use the following format when responding:
    { My band score. Only a number }|{ Evaluation of my answer }|{ your revised version of my response }

    Make sure the band score, evaluation of my answer, and your revised version is separated by the "|" character,
    because I am gonna do python: .split('|') in your response to make a list.
    Do not include the "{" and "}" characters when responding.
    """

    contents = [
        types.Content(
            role='user',
            parts=[
                types.Part.from_text(
                    text=
                    task_prompt + f"""
                    Here is the task's prompt:
                    {question}

                    ---

                    Here is the my answer:
                    {user_response}

                    ---
                    """ + prompt_instructions
                ),
            ],
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=model_configs['generation_config'].get('temperature', ''),
        top_p=model_configs['generation_config'].get('top_p', ''),
        top_k=model_configs['generation_config'].get('top_k', ''),
        max_output_tokens=model_configs['generation_config'].get('max_output_tokens', ''),
        response_mime_type=model_configs['generation_config'].get('response_mime_type', 'text/plain'),
    )

    try:
        model_response = []
        for chunk in ai_client.models.generate_content_stream(
            model=model_configs['model_name'],
            contents=contents,
            config=generate_content_config):
            model_response.append(chunk.text)
        full_response = ' '.join(model_response)
        split_response = full_response.split('|')
        print(split_response)
        if len(split_response) != 3:
            raise Exception
        
        band_score = split_response[0].strip().replace(" ", "")
        evaluation = split_response[1].strip()
        improved_version = split_response[2].strip()
        return Response({"band_score": band_score, "evaluation": evaluation, "improve_version": improved_version})
    except Exception as e:
        print(f"An error occurred: {e}")
        error_response = "Ooops.. looks like the AI evaluator is not available at the moment. You may try again by refreshing the page."
        return Response({"band_score": 0, 
                         "evaluation": error_response, 
                         "improve_version": error_response})
    

def gemini_1_5_eval(model_configs, context, prompt_input, eval_len):
    model = genai1.GenerativeModel(
        model_name=model_configs['model_name'],
        safety_settings=model_configs['safety_settings'],
        generation_config=model_configs['generation_config'],
        system_instruction=model_configs['system_prompt']
    )

    split_response = ["Ooops.. looks like the AI evaluator is not available at the moment." for _ in range(eval_len)]

    prompt_goal = f"""
    Explain the following questions and answers below.
    Specify the paragraph where the answer to each question can be found.

    Here are the questions and answers:
    {prompt_input}

    """

    prompt_instructions = """
    ---
    Each explanation should not exceed to two sentences.
    Strictly use the following format when responding:
    {Explanation of answer 1}|{Explanation of answer 2}|...

    Make sure each explanation is just separated by the "|" character,
    because I am gonna do python: .split('|') in your response to make a list that contains each explanation for each answers.
    Do not refer to the answers by number. For example, do not mention "Answer #1", only refer to them as "Answer".

    """

    prompt_context = f"""
    --

    Here's the context:
    {context}
    """

    full_prompt = prompt_goal + prompt_instructions + prompt_context
    print(full_prompt)
    try:
        response = model.generate_content(full_prompt)
        split_response = response.text.split('|')
        print(split_response)
        if len(split_response) != eval_len:
            raise Exception
        return split_response
    except Exception as e:
        print(f"An error occurred: {e}")
        return split_response


def gemini_2_eval(model_configs, context, question, gt_answer):
    ai_client = genai.Client(api_key=settings.AI_API_KEY)
    contents = [
        types.Content(
            role='user',
            parts=[
                types.Part.from_text(
                    text=
                    f"""
                    Explain why the answer is "{gt_answer}" in this question "{question}".
                    Point out which paragraph I can find the answer in the question.

                    Here's the context:
                    {context}

                    Give a short explanation. Do not exceed to 50 words.
                    """
                ),
            ],
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=model_configs['generation_config'].get('temperature', ''),
        top_p=model_configs['generation_config'].get('top_p', ''),
        top_k=model_configs['generation_config'].get('top_k', ''),
        max_output_tokens=model_configs['generation_config'].get('max_output_tokens', ''),
        response_mime_type=model_configs['generation_config'].get('response_mime_type', 'text/plain'),
    )

    model_response = []
    for chunk in ai_client.models.generate_content_stream(
        model=model_configs['model_name'],
        contents=contents,
        config=generate_content_config):
        model_response.append(chunk.text)
    return ' '.join(model_response) 


def ai_evaluation(context, questions, answers, model="gemini-2"):
    # return f"{question} -- {gt_answer}"
    model_configs = fetch_model_configs()
    print(f"Using {model_configs['model_name']} model.")

    prompt_input = ""
    for idx, question in enumerate(questions):
        prompt_input += f"Question {idx+1}: {question} -- Answer {idx+1}: {answers[idx]}\n"

    if model == "gemini-2":
        return gemini_2_eval(model_configs, context, prompt_input)
    else:
        return gemini_1_5_eval(model_configs, context, prompt_input, len(questions))
    
    
def validate_single_choice_answer(choices, user_answers, correct_answers,
                                   questions, context):
    score = 0
    n_choices = len(choices[0])
    evaluation, evaluation_class, correct_label_answers = [], [], []

    for n, ans in enumerate(correct_answers):
        evaluation_class.append([])
        for m in range(n_choices):
            evaluation_class[n].append('sol' if ans == m else '')
        correct_label_answers.append(choices[n][ans])

    if user_answers:
        user_answers_list = list(user_answers.values())

        for n, ans in enumerate(correct_answers):
            if user_answers_list[n] == ans:
                    score += 1
                    evaluation_class[n][ans] = 'correct'
            else:
                if user_answers_list[n] is not None:
                    evaluation_class[n][user_answers_list[n]] = 'wrong'

    evaluation = ai_evaluation(context, questions, correct_label_answers, MODEL_TO_USE)
    return {"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class}


def validate_map_answer(user_answers, correct_answers, rows, n_questions, context):
    score = 0
    evaluation, evaluation_class, correct_label_answers = [], [], []


    for n, ans in enumerate(correct_answers):
        evaluation_class.append([])
        for m in range(n_questions):
            evaluation_class[n].append('sol' if ans == m else '')
        correct_label_answers.append(f'Is in {chr(correct_answers[n] + ord("A"))}')

    if user_answers:
        user_answers_list = list(user_answers.values())

        for n, ans in enumerate(correct_answers):
            if user_answers_list[n] == ans:
                    score += 1
                    evaluation_class[n][ans] = 'correct'
            else:
                if user_answers_list[n] is not None:
                    evaluation_class[n][user_answers_list[n]] = 'wrong'

    evaluation = ai_evaluation(context, rows, correct_label_answers, MODEL_TO_USE)
    return {"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class}


def validate_wordbox_answer(user_answers, correct_answers,
                                   questions, context):
    score = 0
    evaluation, evaluation_class, labeled_questions, correct_label_answers = [], [], [], []
    for n in range(len(correct_answers)):
        evaluation_class.append('wrong')

    for n, question in enumerate(questions):
        labeled_questions.append(question.split('|')[0] + "___" + question.split('|')[2])
        correct_label_answers.append(correct_answers[n])

    if user_answers:
        user_answers_list = list(user_answers.values())

        for n in range(len(correct_answers)):
            if user_answers_list[n] == correct_answers[n]:
                score += 1
                evaluation_class[n] = 'correct'
            else:
                evaluation_class[n] = 'wrong'

    evaluation = ai_evaluation(context, labeled_questions, correct_label_answers, MODEL_TO_USE)
    return {"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class}


def validate_table_answer(user_answers, correct_answers,
                                   table_data, context, topic):
    score = 0
    evaluation, evaluation_class, labeled_question, correct_label_answers = [], [], [], []
    for n in range(len(correct_answers)):
        evaluation_class.append('wrong')

    for n, row in enumerate(table_data[1:]):
        for m, col in enumerate(row):
            if "|" in col:
                labeled_question.append(remove_numbered_pipes(f"""
                "In table={topic}, column={table_data[0][m]}, row={row[0]}"
                """))
                correct_label_answers.append(correct_answers[n])

    if user_answers:
        user_answers_list = list(user_answers.values())

        for n in range(len(correct_answers)):
            if user_answers_list[n] == correct_answers[n]:
                score += 1
                evaluation_class[n] = 'correct'
            else:
                evaluation_class[n] = 'wrong'
    
    evaluation = ai_evaluation(context, labeled_question, correct_label_answers, MODEL_TO_USE)
    return {"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class}


def validate_multi_choice_answer(choices, user_answers, correct_answers,
                                   questions, context):
    score = 0
    n_choices = len(choices[0])
    evaluation, evaluation_class, correct_label_answers = [], [], []

    for n, ans in enumerate(correct_answers):
        evaluation_class.append([])
        for m in range(n_choices):
            evaluation_class[n].append('sol' if m in ans else '')
        correct_label_answers.append([choices[n][i] for i in ans])  
        
    if user_answers:
        user_answers_list = list(user_answers.values())
        for i, a in enumerate(user_answers_list):
            if a is None:
                user_answers_list[i] = [None for _ in correct_answers[0]]

        for n, ans in enumerate(correct_answers):
            for uans in user_answers_list[n]: 
                if uans in ans:
                    score += 1
                    evaluation_class[n][uans] = 'correct'
                else:
                    if uans is not None:
                        evaluation_class[n][uans] = 'wrong'
    
    evaluation = ai_evaluation(context, questions, correct_label_answers, MODEL_TO_USE)
    return {"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class}


def validate_blank_answers(user_answers, correct_answers, questions, context, topics):
    score = 0
    evaluation, evaluation_class, labeled_questions, correct_label_answers = [], [], [], []

    for n, ans in enumerate(correct_answers):
        evaluation_class.append([])
        evaluation.append([])
        for m in range(len(correct_answers[0])):
            evaluation_class[n].append('wrong')
            blank_question = questions[n][m].split('|')[0] + "___" + questions[n][m].split('|')[2]
            labeled_questions.append(f'{topics[n]}: {blank_question}')
            correct_label_answers.append(correct_answers[n][m])

    if user_answers:
        user_answers_list = list(user_answers.values())

        for n, ans in enumerate(correct_answers):
            for m in range(len(ans)):
                uans = user_answers_list[n][m]
                if uans == ans[m]:
                    score += 1
                    evaluation_class[n][m] = 'correct'
                else:
                    evaluation_class[n][m] = 'wrong'
    evaluation = ai_evaluation(context, labeled_questions, correct_label_answers, MODEL_TO_USE)
    return {"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class}


def validate_answers(test_data, full_user_answers):
    score = 0
    evaluation, evaluation_class = [], []
    context = test_data.get("context").get("context")
    for idx, question in enumerate(test_data.get("question_sets")):
        test_type = question.get("test_type")
        questions = question.get("questions")
        correct_answers = question.get("answers")
        choices = question.get("choices")
        topics = question.get("topics")
        table_data = question.get("table_data")

        user_answers = full_user_answers.get(f"{test_type}_{idx}", {})

        if user_answers: # Handle unanswered questions
            user_answers = handle_unanswered_question(user_answers, correct_answers)
        
        validation_methods = {
            'single_selection': lambda: validate_single_choice_answer(choices, user_answers, correct_answers, questions, context),
            'double_selection': lambda: validate_multi_choice_answer(choices, user_answers, correct_answers, questions, context),
            'fill_table': lambda: validate_table_answer(user_answers, correct_answers, table_data, context, topics[0]),
            'word_box': lambda: validate_wordbox_answer(user_answers, correct_answers, questions, context),
            'map': lambda: validate_map_answer(user_answers, correct_answers, table_data[1], len(table_data[0]), context),
        }

        res = validation_methods.get(test_type, lambda: validate_blank_answers(user_answers, correct_answers, questions, context, topics))()

        score += res["score"]
        evaluation.append(res["evaluation"])
        evaluation_class.append(res["evaluation_class"])
    
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})