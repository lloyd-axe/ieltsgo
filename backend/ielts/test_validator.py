from django.shortcuts import render

import google.generativeai as genai
from rest_framework.response import Response
from django.conf import settings

genai.configure(api_key=settings.AI_API_KEY)


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


def validate_single_choice_answer(n_choices, user_answers, correct_answers):
    score = 0
    evaluation = []
    for n, ans in enumerate(correct_answers):
        evaluation.append([])
        for m in range(n_choices):
            evaluation[n].append('sol' if ans == m else '')

    if not user_answers:
        return Response({"score": score, "evaluation": evaluation})
    
    user_answers_list = list(user_answers.values())

    for n, ans in enumerate(correct_answers):
        if user_answers_list[n] == ans:
                score += 1
                evaluation[n][ans] = 'correct'
        else:
            if user_answers_list[n] is not None:
                evaluation[n][user_answers_list[n]] = 'wrong'
            
    print('eval', evaluation)
    return Response({"score": score, "evaluation": evaluation})


def validate_matching_answer(user_answers, correct_answers):
    score = 0
    evaluation = []
    for n in range(len(correct_answers)):
        evaluation.append('')

    if not user_answers:
        return Response({"score": score, "evaluation": evaluation})
    
    user_answers_list = list(user_answers.values())

    for n in range(len(correct_answers)):
        if user_answers_list[n] == correct_answers[n]:
            score += 1
            evaluation[n] = 'correct'
        else:
            evaluation[n] = 'wrong'
            
    print('eval', evaluation)
    return Response({"score": score, "evaluation": evaluation})


def validate_multi_choice_answer(n_choices, user_answers, correct_answers):
    score = 0
    evaluation = []
    for n, ans in enumerate(correct_answers):
        evaluation.append([])
        for m in range(n_choices):
            evaluation[n].append('sol' if m in ans else '')
            
    if not user_answers:
        print('eval', evaluation)
        return Response({"score": score, "evaluation": evaluation})
    
    user_answers_list = list(user_answers.values())
    for i, a in enumerate(user_answers_list):
        if a is None:
            user_answers_list[i] = [None for _ in correct_answers[0]]

    for n, ans in enumerate(correct_answers):
        for uans in user_answers_list[n]: 
            if uans in ans:
                score += 1
                evaluation[n][uans] = 'correct'
            else:
                if uans is not None:
                    evaluation[n][uans] = 'wrong'
            
    print('eval', evaluation)
    return Response({"score": score, "evaluation": evaluation})


def validate_answers(n_choices, user_answers, correct_answers):
    score = 0
    evaluation = []
    for n, ans in enumerate(correct_answers):
        evaluation.append([])
        for m in range(n_choices):
            evaluation[n].append('wrong')

    if not user_answers:
        print('eval', evaluation)
        return Response({"score": score, "evaluation": evaluation})
    
    user_answers_list = list(user_answers.values())

    for n, ans in enumerate(correct_answers):
        for m in range(len(ans)):
            uans = user_answers_list[n][m]
            if uans == ans[m]:
                score += 1
                evaluation[n][m] = 'correct'
            else:
                evaluation[n][m] = 'wrong'
    print('eval', evaluation)
    return Response({"score": score, "evaluation": evaluation})
