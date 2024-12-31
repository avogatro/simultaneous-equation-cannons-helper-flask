
"""
validate input
"""
from typing import Counter

def parse_monster_level(list_of_str):
    """ validate monster level"""
    if len(list_of_str) <= 0 or len(list_of_str)>12:
        # length of list > 12
        return []

    # level monster if not in range
    try:
        res = list(map(int, list_of_str))
        res = Counter(res)
        res_keys = res.keys()
        if len(list(filter(lambda x: x <= 0 or x >12 , res_keys))) > 0:
            return []

        return res_keys
    except ValueError:
        # value can not be converted to int
        return []
