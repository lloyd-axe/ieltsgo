import json
from ielts.models import TestInformation, ContextModel, QuestionsSetModel, TestModel, AIConfigs

# python manage.py shell
# exec(open('insert_data.py').read())
# \n<br/><br/>\n
def add_context(item):
    obj, created = ContextModel.objects.get_or_create(
        subject=item["subject"],
        defaults={
                "context": item["context"],
                "audio_url": item.get("audio_url"),
                "image_url": item.get("image_url"),
            }
        )
    if created:
        print(f"Added Context: {item['subject']}")
        return False
    else:
        print(f"Skipped duplicate: {item['subject']}")
        return True

def add_test(skill, item):
    context = ContextModel.objects.get(subject=item["subject"])
    obj, created = TestModel.objects.get_or_create(
        context=context,
        defaults={
            "skill": skill
        }
    )
    if created:
        print(f"Added Test: {item['subject']}")
    else:
        print(f"Skipped duplicate: {item['subject']}")

def add_question(subject, question):
    context = ContextModel.objects.get(subject=subject)
    QuestionsSetModel.objects.create(
        test_type=question["test_type"],
        context=context,
        questions=question.get("questions", []),
        answers=question.get("answers", []),
        topics=question.get("topics", None),
        choices=question.get("choices", None),
        table_data=question.get("table_data", None),
        word_box=question.get("word_box", None),
    )
    print(f"Added Question Set: {question['test_type']}-{subject}")

def add_info(item):
    obj, created = TestInformation.objects.get_or_create(
    test_type=item["test_type"],
    defaults={
        "information": item["information"]
    }
    )
    if created:
        print(f"Added Test Information: {item['test_type']}")
    else:
        print(f"Skipped duplicate: {item['test_type']}")


with open("data.json", "r", encoding="utf-8") as file:
    data = json.load(file)

    test_info = data.get("TestInformation")
    test_data = data.get("Tests")

    if test_info:
        for item in test_info:
            add_info(item)

    if test_data:
        for skill in ["writing", "reading", "listening"]:
            print(f'Adding {skill} tests...')
            test = test_data.get(skill)
            if test:
                for test_item in test:
                    is_double = add_context(test_item)
                    if not is_double:
                        add_test(skill, test_item)
                        for question in test_item["question_set"]:
                            add_question(test_item["subject"], question)
    print('DONE!')
