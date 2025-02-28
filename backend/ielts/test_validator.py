from django.shortcuts import render
from google import genai
from google.genai import types
from rest_framework.response import Response
from django.conf import settings
from .models import AIConfigs
from .serializers import AIConfigsSerializer

ai_client = genai.Client(api_key=settings.AI_API_KEY)

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


def validate_writing_answer(model, user_response, question, task_prompt):
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


def ai_evaluation(context, question, gt_answer):
    model_configs = fetch_model_configs()
    print(f"Using {model_configs['model_name']} model.")
    
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


def validate_single_choice_answer(choices, user_answers, correct_answers,
                                   questions, context):
    score = 0
    n_choices = len(choices[0])
    evaluation, evaluation_class = [], []

    for n, ans in enumerate(correct_answers):
        evaluation_class.append([])
        for m in range(n_choices):
            evaluation_class[n].append('sol' if ans == m else '')
        evaluation.append(ai_evaluation(context, questions[n], choices[n][ans]))

    if user_answers:
        user_answers_list = list(user_answers.values())

        for n, ans in enumerate(correct_answers):
            if user_answers_list[n] == ans:
                    score += 1
                    evaluation_class[n][ans] = 'correct'
            else:
                if user_answers_list[n] is not None:
                    evaluation_class[n][user_answers_list[n]] = 'wrong'
            
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})

def validate_map_answer(choices, user_answers, correct_answers,
                                   questions, context):
    score = 0
    n_choices = len(choices)
    evaluation, evaluation_class = [], []

    for n, ans in enumerate(correct_answers):
        evaluation_class.append([])
        for m in range(n_choices):
            evaluation_class[n].append('sol' if ans == m else '')
        evaluation.append(ai_evaluation(context, questions[n], choices[n][ans]))

    if not user_answers:
        return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})
    
    user_answers_list = list(user_answers.values())

    for n, ans in enumerate(correct_answers):
        if user_answers_list[n] == ans:
                score += 1
                evaluation_class[n][ans] = 'correct'
        else:
            if user_answers_list[n] is not None:
                evaluation_class[n][user_answers_list[n]] = 'wrong'
            
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})


def validate_wordbox_answer(user_answers, correct_answers,
                                   questions, context):
    score = 0
    evaluation, evaluation_class = [], []
    for n in range(len(correct_answers)):
        evaluation_class.append('')

    for n, question in enumerate(questions):
        blank_question = question.split('|')[0] + "___" + question.split('|')[2]
        evaluation.append(ai_evaluation(context, blank_question, correct_answers[n]))

    if user_answers:
        user_answers_list = list(user_answers.values())

        for n in range(len(correct_answers)):
            if user_answers_list[n] == correct_answers[n]:
                score += 1
                evaluation_class[n] = 'correct'
            else:
                evaluation_class[n] = 'wrong'
            
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})


def validate_table_answer(user_answers, correct_answers,
                                   table_data, context, topic):
    score = 0
    evaluation, evaluation_class = [], []
    for n in range(len(correct_answers)):
        evaluation_class.append('')

    #find right columns
    col_num = 0
    for n, row in enumerate(table_data[1:]):
        for m, col in enumerate(row):
            if "|" in col:
                col_num = m
        row_txt = row[0].split('|')[0] + "___" + row[0].split('|')[2]
        question = f"""
        In table={topic}, column={table_data[0][col_num]}, row={row_txt}
        """
        evaluation.append(ai_evaluation(context, question, correct_answers[n]))

    if user_answers:
        user_answers_list = list(user_answers.values())

        for n in range(len(correct_answers)):
            if user_answers_list[n] == correct_answers[n]:
                score += 1
                evaluation_class[n] = 'correct'
            else:
                evaluation_class[n] = 'wrong'
            
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})


def validate_multi_choice_answer(choices, user_answers, correct_answers,
                                   questions, context):
    score = 0
    n_choices = len(choices[0])
    evaluation, evaluation_class = [], []

    for n, ans in enumerate(correct_answers):
        evaluation_class.append([])
        for m in range(n_choices):
            evaluation_class[n].append('sol' if m in ans else '')
        evaluation.append(ai_evaluation(
            context, 
            questions[n], 
            [choices[n][i] for i in ans]))    
        
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

    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})


def validate_answers(user_answers, correct_answers, questions, context, topics):
    score = 0
    evaluation, evaluation_class = [], []

    for n, ans in enumerate(correct_answers):
        evaluation_class.append([])
        evaluation.append([])
        for m in range(len(correct_answers[0])):
            evaluation_class[n].append('wrong')
            blank_question = questions[n][m].split('|')[0] + "___" + questions[n][m].split('|')[2]
            q = f'{topics[n]}: {blank_question}'
            evaluation[n].append(ai_evaluation(context, q, correct_answers[n][m]))

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
    return Response({"score": score, "evaluation": evaluation, "evaluation_class": evaluation_class})
