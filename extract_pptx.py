import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text_from_pptx(pptx_path, out_path):
    try:
        with zipfile.ZipFile(pptx_path, 'r') as z:
            slides = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
            slides.sort(key=lambda x: int(''.join(filter(str.isdigit, x))))
            
            with open(out_path, 'w', encoding='utf-8') as out:
                for slide in slides:
                    out.write(f"--- {slide} ---\n")
                    xml_content = z.read(slide)
                    root = ET.fromstring(xml_content)
                    texts = []
                    for node in root.iter():
                        if node.tag.endswith('}t') and node.text:
                            texts.append(node.text)
                    out.write('\n'.join(texts))
                    out.write("\n\n")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    extract_text_from_pptx(sys.argv[1], sys.argv[2])
