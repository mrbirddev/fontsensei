import os

# List of locales and their corresponding languages
locales = [
    {"locale": "en", "lang": "English"},
    {"locale": "es", "lang": "Español"},
    {"locale": "pt-br", "lang": "Português do Brasil"},
    {"locale": "de", "lang": "Deutsch"},
    {"locale": "fr", "lang": "Français"},
    {"locale": "he", "lang": "עִבְרִית"},
    {"locale": "ja", "lang": "日本語"},
    {"locale": "it", "lang": "Italiano"},
    {"locale": "nl", "lang": "Nederlands"},
    {"locale": "ru", "lang": "Русский"},
    {"locale": "tr", "lang": "Türkçe"},
    {"locale": "id", "lang": "Bahasa Indonesia"},
    {"locale": "zh-cn", "lang": "简体中文"},
    {"locale": "zh-tw", "lang": "繁體中文"},
    {"locale": "ko", "lang": "한국어"},
    {"locale": "ar", "lang": "العربية"},
    {"locale": "sv", "lang": "Svenska"}
]

# Loop through each locale
for locale in locales:
    # Create the directory if it doesn't exist
    os.makedirs(locale["locale"], exist_ok=True)

    # Create the .prompt.md file in the directory
    with open(f'{locale["locale"]}/.prompt.md', 'w') as file:
        file.write(f"""
You are a helpful translator. Help me translate a typescript file into {locale["lang"]}
- You are translating locale strings for a SaaS website builder, so a lot of technical terms like CSS and HTML are involved.
- Translation should be based ONLY on the value, not the key.
- Keep the key un-translated.
- DO NOT wrap your output into markdown code blocks, as you are outputting to a typescript file
- Output key value pairs ONLY, no curly braces. For manually concatenation later.
- Make sure the ending pair has a trailing comma.
- NO NEED to preserve comments & linebreaks in the original file.

An input example =====================================
"Direction": "Direction",
"Normal": "Normal",
"Reverse": "Reverse",
"Alternate": "Alternate",
An output example in zh-cn =====================================
"Direction": "方向",
"Normal": "正常",
"Reverse": "反向",
"Alternate": "交替",
""")

print("Directories created and files written successfully.")

