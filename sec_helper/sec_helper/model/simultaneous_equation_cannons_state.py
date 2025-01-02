"""
This is helper class for the card "Simultaneous Equation Cannons" in the Game YoGiOh

Card text:

Banish 1 Fusion Monster and 2 Xyz Monsters with the same Rank from your Extra Deck,
whose combined Level and Ranks equal the total number of cards in both players' hands
and on the field, then you can apply this effect.

- Return 2 of your banished monsters to the Extra Deck (1 Xyz and 1 Fusion) whose
combined Level and Rank equal the Level or Rank of 1 face-up monster your opponent controls, 
then banish all cards they control.

Card Explanation:

I want to activate the 2nd effect, banish all cards my opponent controls.
Imagine there are in total 14 cards in both players hands and on the board, and your opponent has 1 level 8 monster.

To activate my card, I need to banish 2 XYZ Monster with Rank R and 1 fusion monsters Level L.

Equation 1: Rank R + Rank R + Level L = 14
Equation 2: Rank R + Level L = 8

Solution:
Equation 3 is Equation 1 - Equation 2: R = 14-8 = 6

Equation 4 is Equation 2 - Equation 3: L = 8-6 = 2

The XYZ Rank you send is "Total card number in hands and on board" - "the matching monster level".
The Fusion Level you send is "the matching Monster level" - the difference of above.

"""
from typing import List
from dataclasses import dataclass, field
from enum import Enum, unique
import operator

### enable import sub modules in current directory
# pylint: disable=C0411
import os
import sys
import inspect

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, current_dir)
### end

from hct_color_finder import HctColorFinder

@unique
class CardOperation(Enum):
    """add or remove monster level"""
    PLUS = 0
    MINUS = 1


@unique
class MonsterKind(Enum):
    """we only care about fusion and xyz for SimultaneousEquationCannons"""
    FUSION = 0
    XYZ = 1


@unique
class CompareMode(Enum):
    """if we use banished monster for 2nd SEC calculation, do we exclude xyz monster in banished zone from extra deck"""
    EXCLUDE = 0
    NOT_EXCLUDE = 1


@dataclass(order=True)
class SimultaneousEquationCannonsSolution:
    """Class for keeping track of SimultaneousEquationCannonsSolution"""
    sort_index_1: int = field(init=False, repr=False)
    sort_index_2: int = field(init=False, repr=False)
    solution_exist: bool = False
    monster_level_on_board: int = 0
    total_cards: int = 0
    send_xyz_rank: int = 0
    send_fusion_level: int = 0
    returned_xyz_rank: int = 0
    returned_fusion_level: int = 0


def __post_init__(self):
    self.sort_index_1 = self.total_cards
    self.sort_index_2 = self.send_xyz_rank

class SimultaneousEquationCannonsState():
    """Class for organizing State of SimultaneousEquationCannons Helper"""
    _fusion_levels: List[int] = []
    _xyz_ranks: List[int] = []
    _value_table = dict()

    _banished_fusion_levels: List[int] = []
    _banished_xyz_ranks: List[int] = []
    _compare_mode = CompareMode.EXCLUDE

    min_total: int = 0
    max_total: int = 1000

    hct_color_finder: HctColorFinder = None
    def __init__(self, fusion_levels: List[int], xyz_ranks: List[int],
                 banished_fusion_levels: List[int], banished_xyz_ranks: List[int],
                 compare_mode: CompareMode = CompareMode.EXCLUDE
                 ):
        self.hct_color_finder = HctColorFinder(chroma=44,tone=61)
        self.set_extra_deck_monster_level(fusion_levels, xyz_ranks)
        self.set_banish_zone_monster_level(banished_fusion_levels, banished_xyz_ranks, compare_mode)
        self.generate_value_table()

    def generate_value_table(self):
        """
        generate dictionary with key=monster_level_on_field_to_match and
        value=total_cards_in_both_players_hand_and_on_both_players_board

        monster_level_on_field_to_match can be more than Xyz_Rank + Fusion_Level
        if there are left over xyz or fusion from past SEC in banished zone

        in that case monster_level_on_field_to_match = every possible combination of 
        Xyz_Rank and Fusion_Level in Banished Zone

        CompareMode.EXCLUDE means if we have a Rank 4 Xyz Monster Banished, we do not send
        2 more Rank 4, because we may not have more rank 4 in extra decks.
        This is the normal case, unless we play more than 2x Rank 4 Monster
        """
        self.min_total = 1000
        self.max_total = 0
        self._value_table = {}

        temp_fusion_levels = self.fusion_levels
        temp_xyz_ranks = self.xyz_ranks
        # exclude mode will remove extra deck level/rank if they are also banished
        if self._compare_mode == CompareMode.EXCLUDE:
            temp_xyz_ranks = [xyz for xyz in self.xyz_ranks if xyz not in self.banished_xyz_ranks]
            temp_fusion_levels = [fusion for fusion in self.fusion_levels if fusion not in self.banished_fusion_levels]

        for fusion_lvl in temp_fusion_levels:
            for xyz_rank in temp_xyz_ranks:
                # add the monster level for banished zone not empty
                if self._banished_fusion_levels.count or self._banished_xyz_ranks.count:
                    temp_banished_fusion = self._banished_fusion_levels + [fusion_lvl]
                    temp_banished_xyz = self._banished_xyz_ranks + [xyz_rank]
                    for banished_fusion in temp_banished_fusion:
                        for banished_xyz in temp_banished_xyz:
                            self._add_new_solution_to_value_table(banished_fusion, banished_xyz, fusion_lvl, xyz_rank)
                else:
                    # add the monster level for empty banished zone
                    self._add_new_solution_to_value_table(fusion_lvl, xyz_rank, fusion_lvl, xyz_rank)

        self._sort_and_remove_duplicate_from_value_table()

    def _sort_and_remove_duplicate_from_value_table(self):
        # pylint: disable=C0201
        for k in self._value_table.keys():
            self._value_table[k] = sorted(self._value_table[k], key=operator.attrgetter("total_cards")) 
        self._value_table = dict(sorted(self._value_table.items()))
    def _add_new_solution_to_value_table(self, returned_fusion_level, returned_xyz_rank,
                                         send_fusion_level, send_xyz_rank):
        """ 
        append total_card to existing list with key l+r in value_table 
        or create new list with key l+r in value_table
        """
        total = send_fusion_level + send_xyz_rank * 2
        self.min_total = min(self.min_total, total)
        self.max_total = max(self.max_total, total)
        solution = SimultaneousEquationCannonsSolution(solution_exist=True,
                                                       monster_level_on_board=returned_fusion_level + returned_xyz_rank,
                                                       total_cards=total,
                                                       send_xyz_rank=send_xyz_rank,
                                                       send_fusion_level=send_fusion_level,
                                                       returned_xyz_rank=returned_xyz_rank,
                                                       returned_fusion_level=returned_fusion_level,
                                                       )
        if returned_fusion_level + returned_xyz_rank in self._value_table:
            self._value_table[returned_fusion_level + returned_xyz_rank].append(solution)
        else:
            self._value_table[returned_fusion_level + returned_xyz_rank] = [solution]

    def _check_input(self, new_fusion_levels: List[int], new_xyz_ranks: List[int]):
        """level/rank input validation"""
        extra_deck_size = len(new_fusion_levels) + len(new_xyz_ranks) * 2
        if extra_deck_size < 0 or extra_deck_size > 15:
            raise ValueError(f"extra_deck_size out of range: {extra_deck_size}")

        for level in new_fusion_levels:
            if level < 1 or level > 12:
                raise ValueError(f"fusion level out of range {level}")

        for rank in new_xyz_ranks:
            if rank < 0 or rank > 13:
                raise ValueError(f"xyz level out of range {rank}")

    def set_extra_deck_monster_level(self, new_fusion_levels: List[int], new_xyz_ranks: List[int]):
        """set extra deck input and prepare value table"""
        self._check_input(new_fusion_levels, new_xyz_ranks)

        self._fusion_levels = sorted(new_fusion_levels)
        self._xyz_ranks = sorted(new_xyz_ranks)
        # self._generate_value_table()

    @property
    def fusion_levels(self):
        """fusion monster levels in extra deck"""
        return self._fusion_levels

    @property
    def xyz_ranks(self):
        """xyz monster ranks in extra deck"""
        return self._xyz_ranks

    @property
    def banished_xyz_ranks(self):
        """banished xyz monster levels"""
        return self._banished_xyz_ranks

    @property
    def banished_fusion_levels(self):
        """banished fusion monster levels"""
        return self._banished_fusion_levels

    @property
    def value_table(self):
        """show what total card number and matching monster level are needed for the banash effect to resolve"""
        return self._value_table

    def print_value_table(self):
        """debug output print value_table """
        print(f"fusion_levels\t{self.fusion_levels}")
        print(f"xyz_ranks\t{self.xyz_ranks}")
        print(f"banished_fusion_levels\t{self.banished_fusion_levels}")
        print(f"xyz_rank\t{self.banished_xyz_ranks}")

        for k in sorted(self._value_table.keys()):
            total  = [x.total_cards for x in self._value_table[k]]
            print(f"Monster Lvl/Rank to Match: {k} \t Possible Total Cards: {total}")

    def reset_banish_zone_monster_level(self):
        """remove all banished xyz/fusion monster from calculation"""
        self._banished_fusion_levels = []
        self._banished_xyz_ranks = []

    def set_banish_zone_monster_level(self, banished_fusion_levels: List[int],
                                      banished_xyz_ranks: List[int], compare_mode: CompareMode):
        """set banished xyz/fusion monster for calculation"""
        self._check_input(banished_fusion_levels, banished_xyz_ranks)
        self._compare_mode = compare_mode
        self._banished_fusion_levels = sorted(banished_fusion_levels)
        self._banished_xyz_ranks = sorted(banished_xyz_ranks)

    def find_color_range(self):
        """find color range for visually distinguish total levels"""
        res= {}
        if self.min_total >=1000 or self.max_total <= 0:
            return res
        steps = self.max_total - self.min_total + 1

        colors = self.hct_color_finder.find_colors(steps)

        for step in range(steps):
            res[self.min_total+step] = colors[step]
        return res
