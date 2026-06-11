// Helper to format a color string (HSL)
function findHslColor(index, totalSteps) {
    if (totalSteps <= 0) return '#000000';
    const hueStep = 360.0 / totalSteps;
    const hue = (index * hueStep + 180) % 360;
    const lightness = 50 + (index % 2) * 15; // vary lightness slightly
    return `hsl(${hue}, 70%, ${lightness}%)`;
}

class SimultaneousEquationCannonsSolution {
    constructor(
        monster_level_on_board,
        total_cards,
        send_xyz_rank,
        send_fusion_level,
        returned_xyz_rank,
        returned_fusion_level
    ) {
        this.solution_exist = true;
        this.monster_level_on_board = monster_level_on_board;
        this.total_cards = total_cards;
        this.send_xyz_rank = send_xyz_rank;
        this.send_fusion_level = send_fusion_level;
        this.returned_xyz_rank = returned_xyz_rank;
        this.returned_fusion_level = returned_fusion_level;
    }
}

export class SimultaneousEquationCannonsState {
    constructor(
        fusion_levels = [],
        xyz_ranks = [],
        banished_fusion_levels = [],
        banished_xyz_ranks = []
    ) {
        this._fusion_levels = [...fusion_levels].sort((a, b) => a - b);
        this._xyz_ranks = [...xyz_ranks].sort((a, b) => a - b);
        this._banished_fusion_levels = [...banished_fusion_levels].sort((a, b) => a - b);
        this._banished_xyz_ranks = [...banished_xyz_ranks].sort((a, b) => a - b);
        this._compare_mode = 0; // 0 is EXCLUDE
        this.min_total = 1000;
        this.max_total = 0;
        this.value_table = {};
        
        this.generate_value_table();
    }

    generate_value_table() {
        this.min_total = 1000;
        this.max_total = 0;
        this.value_table = {};

        let temp_fusion_levels = this._fusion_levels;
        let temp_xyz_ranks = this._xyz_ranks;

        if (this._compare_mode === 0) {
            temp_xyz_ranks = this._xyz_ranks.filter(xyz => !this._banished_xyz_ranks.includes(xyz));
            temp_fusion_levels = this._fusion_levels.filter(fusion => !this._banished_fusion_levels.includes(fusion));
        }

        for (const fusion_lvl of temp_fusion_levels) {
            for (const xyz_rank of temp_xyz_ranks) {
                if (this._banished_fusion_levels.length > 0 || this._banished_xyz_ranks.length > 0) {
                    const temp_banished_fusion = [...this._banished_fusion_levels, fusion_lvl];
                    const temp_banished_xyz = [...this._banished_xyz_ranks, xyz_rank];
                    
                    for (const banished_fusion of temp_banished_fusion) {
                        for (const banished_xyz of temp_banished_xyz) {
                            this._add_new_solution_to_value_table(banished_fusion, banished_xyz, fusion_lvl, xyz_rank);
                        }
                    }
                } else {
                    this._add_new_solution_to_value_table(fusion_lvl, xyz_rank, fusion_lvl, xyz_rank);
                }
            }
        }

        this._sort_and_remove_duplicate_from_value_table();
    }

    _sort_and_remove_duplicate_from_value_table() {
        for (const key of Object.keys(this.value_table)) {
            // Remove duplicates by total_cards, keep unique
            const uniqueMap = new Map();
            for (const sol of this.value_table[key]) {
                if (!uniqueMap.has(sol.total_cards)) {
                    uniqueMap.set(sol.total_cards, sol);
                }
            }
            this.value_table[key] = Array.from(uniqueMap.values()).sort((a, b) => a.total_cards - b.total_cards);
        }
        
        // Sort keys
        const sortedKeys = Object.keys(this.value_table).sort((a, b) => parseInt(a) - parseInt(b));
        const sortedTable = {};
        for (const k of sortedKeys) {
            sortedTable[k] = this.value_table[k];
        }
        this.value_table = sortedTable;
    }

    _add_new_solution_to_value_table(returned_fusion_level, returned_xyz_rank, send_fusion_level, send_xyz_rank) {
        const total = send_fusion_level + send_xyz_rank * 2;
        this.min_total = Math.min(this.min_total, total);
        this.max_total = Math.max(this.max_total, total);

        const solution = new SimultaneousEquationCannonsSolution(
            returned_fusion_level + returned_xyz_rank,
            total,
            send_xyz_rank,
            send_fusion_level,
            returned_xyz_rank,
            returned_fusion_level
        );

        const key = returned_fusion_level + returned_xyz_rank;
        if (!this.value_table[key]) {
            this.value_table[key] = [];
        }
        this.value_table[key].push(solution);
    }

    find_color_range() {
        const res = {};
        if (this.min_total >= 1000 || this.max_total <= 0) return res;
        
        const steps = this.max_total - this.min_total + 1;
        for (let i = 0; i < steps; i++) {
            res[this.min_total + i] = findHslColor(i, steps);
        }
        return res;
    }
}
