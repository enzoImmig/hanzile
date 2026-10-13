import json
import os
from strokes import strokes

# Tabela de vogais acentuadas para tons 1 a 4
TONE_MARKS = {
    'a': ['ā', 'á', 'ǎ', 'à'],
    'e': ['ē', 'é', 'ě', 'è'],
    'i': ['ī', 'í', 'ǐ', 'ì'],
    'o': ['ō', 'ó', 'ǒ', 'ò'],
    'u': ['ū', 'ú', 'ǔ', 'ù'],
    'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
    'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ']
}

def add_pinyin_tone(syllable: str, tone: int) -> str:
    """Aplica o acento diacrítico tonal adequado à sílaba em pinyin."""
    if tone < 1 or tone > 4:
        return syllable  # Tom neutro (5) ou sem tom

    s = syllable.lower().replace('u:', 'v').replace('ü', 'v')
    
    # Regra 1: Se contiver 'a' ou 'e', recebe o acento
    for v in ['a', 'e']:
        if v in s:
            marked = TONE_MARKS[v][tone - 1]
            return s.replace(v, marked, 1).replace('v', 'ü')
            
    # Regra 2: Se contiver 'ou', o 'o' recebe o acento
    if 'ou' in s:
        marked = TONE_MARKS['o'][tone - 1]
        return s.replace('o', marked, 1).replace('v', 'ü')
        
    # Regra 3: Caso contrário, a última vogal da sequência recebe o acento
    vowels = [i for i, ch in enumerate(s) if ch in 'aiouv']
    if vowels:
        last_v_idx = vowels[-1]
        target_char = s[last_v_idx]
        marked = TONE_MARKS[target_char][tone - 1]
        res = s[:last_v_idx] + marked + s[last_v_idx+1:]
        return res.replace('v', 'ü')
        
    return s.replace('v', 'ü')

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    source_path = os.path.join(root_dir, "hanzi.json")
    out_dir = os.path.join(root_dir, "public", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "hanzi-db.json")

    print(f"Lendo base original de: {source_path}")
    with open(source_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    processed_list = []
    missing_strokes = 0

    for char, entry in data.items():
        # Traços
        try:
            s_count = strokes(char)
            if not isinstance(s_count, int):
                s_count = 1
                missing_strokes += 1
        except Exception:
            s_count = 1
            missing_strokes += 1

        # Pinyin
        pinyin_parts = entry.get("pinyin", [])
        raw_pinyin = "".join(pinyin_parts).lower()
        tone = entry.get("tone", 5)
        display_pinyin = add_pinyin_tone(raw_pinyin, tone)

        # Layout IDC (normaliza null para '独')
        struct = entry.get("structure")
        layout = struct if struct else "独"

        # Componentes
        comps = entry.get("components", [char])

        # Meaning
        meaning = entry.get("meaning", "")

        processed_entry = {
            "char": char,
            "pinyin": raw_pinyin,
            "pinyinDisplay": display_pinyin,
            "tone": tone,
            "strokes": s_count,
            "hsk": entry.get("hsk", 1),
            "layout": layout,
            "radical": entry.get("radical", ""),
            "components": comps,
            "meaning": meaning
        }
        processed_list.append(processed_entry)

    print(f"Total processados: {len(processed_list)}")
    print(f"Faltantes em traços: {missing_strokes}")

    # Salva JSON formatado e compacto
    with open(out_path, "w", encoding="utf-8") as f_out:
        json.dump(processed_list, f_out, ensure_ascii=False, indent=2)

    print(f"Dataset final salvo com sucesso em: {out_path}")
    
    # Amostra dos 3 primeiros
    for sample in processed_list[:3]:
        print("Exemplo:", sample["char"], "->", sample["pinyinDisplay"], f"({sample['strokes']} traços, layout: {sample['layout']}, HSK {sample['hsk']})")

if __name__ == "__main__":
    main()
