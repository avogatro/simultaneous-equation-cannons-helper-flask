from typing import Counter
# from wtforms import Form, SelectMultipleField,IntegerField, validators,FieldList


# monster_level_field = IntegerField(default=0, validators=[validators.NumberRange(min=1, max=12)])
# class FormInputMonsters(Form):

#     #language = SelectMultipleField(u'Programming Language', choices=[('cpp', 'C++'), ('py', 'Python'), ('text', 'Plain Text')])
#     _tmp = list(range(1, 13))
#     xyz_monsters = FieldList()
#     xyz_monsters  = SelectMultipleField('xyz-selection', choices =_tmp)
#     fusion_monsters  = SelectMultipleField('fusion-selection', choices =_tmp)
#     #xyz_monsters = FieldList( 'xyz-selection', monster_level_field)
#     #fusion_monsters = FieldList('fusion-selection', monster_level_field)

 
def parse_monster_level(list_of_str):
    """ validate monster level"""
  
    if len(list_of_str) <= 0 or len(list_of_str)>12:
        # length of list > 12
        return []
    else:
        # level monster if not in range
        try:
            res = list(map(int, list_of_str))
            res = Counter(res)
            res_keys = res.keys()
            if len(list(filter(lambda x: x <= 0 or x >12 , res_keys))) > 0:
                return []
            else:
                return res_keys
        except ValueError:
            # value can not be converted to int
            return []
