import re
from django.shortcuts import render
from google import genai
from google.genai import types
import google.generativeai as genai
from rest_framework.response import Response
from django.conf import settings
from .models import AIConfigs
from .serializers import AIConfigsSerializer

genai.configure(api_key=settings.AI_API_KEY)
MODEL_TO_USE = "gemini-2"

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


def validate_writing_answer(test_type, user_response, question):
    model_configs = fetch_model_configs()
    task_prompt = model_configs[f'task{test_type.split("_")[1]}_prompt']
    model = genai.GenerativeModel(
        model_name=model_configs['model_name'],
        safety_settings=model_configs['safety_settings'],
        generation_config=model_configs['generation_config'],
        system_instruction=model_configs['system_prompt']
    )
    input_prompt = task_prompt + f"""
    Here is the task prompt: [{question}]

    Here is the my answer, count the number of words I used.: [{user_response}]
    """

    response = model.generate_content(input_prompt)
    response_split = response.text.split("|")
    attempts = 0
    while len(response_split) != 3:
        print('attempting again...')
        response = model.generate_content(input_prompt + "\nMake sure to FOLLOW THE FORMAT.")
        response_split = response.text.split("|")
        attempts+=1
        if attempts >= 2:
            print("Too many attempts")
            return Response({"band_score": 0, "evaluation": "Error", "improve_version": "test error"})

    band_score = response_split[0].strip()
    evaluation = response_split[1].strip()
    improve_version = response_split[2].strip()

    return Response({"band_score": band_score, "evaluation": evaluation, "improve_version": improve_version})


def gemini_1_5_eval(model_configs, context, prompt_input):
    model = genai.GenerativeModel(
        model_name=model_configs['model_name'],
        safety_settings=model_configs['safety_settings'],
        generation_config=model_configs['generation_config'],
        system_instruction=model_configs['system_prompt']
    )
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

    """

    prompt_context = f"""
    --

    Here's the context:
    {context}
    """

    full_prompt = prompt_goal + prompt_instructions + prompt_context
    print(full_prompt)
    response = model.generate_content(full_prompt)
    split_response = response.text.split('|')
    print(split_response)
    print('response -- ', len(split_response))
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

    if model == "gemimi-2":
        return gemini_2_eval(model_configs, context, prompt_input)
    else:
        return gemini_1_5_eval(model_configs, context, prompt_input)
    
    
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
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})


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
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})


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
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})


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
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})


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
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})


def validate_answers(user_answers, correct_answers, questions, context, topics):
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
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})
