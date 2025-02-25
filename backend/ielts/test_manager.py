from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .constants import TEST_CONFIG, MODEL_SERIALIZER
from .models import TestInformation, TEST_TYPES


def get_test(skill, test_type, item_id):
    if skill not in TEST_CONFIG.keys():
        return Response({"error": "Invalid skill type."}, status=400)
    
    skill_config = TEST_CONFIG[skill]
    if test_type not in skill_config.keys():
        return Response({"error": "Invalid test type."}, status=400)
            
    test_model, test_serializer = skill_config[test_type]
    test = get_object_or_404(test_model, skill=skill, test_type=test_type, id=item_id)
    serializer = test_serializer(test)
    return Response(serializer.data)


def get_all_tests(skill=None, test_type=None):
    data = []
    if skill != "all":
        skill_config = TEST_CONFIG.get(skill)
        if skill_config:
            if test_type:
                print("Filter by test type.")
                test_model, test_serializer = skill_config.get(test_type)
                test = test_model.objects.filter(test_type=test_type).order_by("id")
                serializer = test_serializer(test, many=True)
                data = serializer.data
            else:
                cur_test_model = None
                print("Filter by skill.")
                for ttype, (test_model, test_serializer) in skill_config.items():
                    if test_model != cur_test_model:
                        cur_test_model = test_model
                        test = cur_test_model.objects.filter(skill=skill).order_by("id")
                        serializer = test_serializer(test, many=True)
                        data += serializer.data
            return Response(data) 
        else:
            return Response({"error": "Invalid skill type."}, status=400)
    else:
        if test_type:
            print("Filter by test type.")
            test_type_config = {}
            for ttype in TEST_CONFIG.values():
                for k, v in ttype.items():
                    test_type_config[k] = v
            print(test_type_config.get(test_type))
            test_model, test_serializer = test_type_config.get(test_type)
            test = test_model.objects.filter(test_type=test_type).order_by("id")
            serializer = test_serializer(test, many=True)
            data = serializer.data
        else:
            print("Fetching all tests.")
            for _, (test_model, test_serializer) in MODEL_SERIALIZER.items():
                test = test_model.objects.order_by("id")
                serializer = test_serializer(test, many=True)
                data += serializer.data
        return Response(data) 


def get_test_types(skill=None):
    if skill:
        skill_config = TEST_CONFIG.get(skill)
        if skill_config:
            return Response({"test_types": list(skill_config.keys())})

    test_types = {test_type[0] for ttype_list in TEST_TYPES.values() for test_type in ttype_list}
    return Response({"test_types": list(test_types)})
    

def get_test_info(test_type):
    test_info = TestInformation.objects.filter(test_types=test_type).values_list("information", flat=True).first()
    return Response({"info": test_info or "Test information does not exists."})


def get_test_type_display_names():
    display_names = {ttype[0]: ttype[1] for ttype_list in TEST_TYPES.values() for ttype in ttype_list}
    display_names["all"] = "All"
    return Response({"display_names": display_names})