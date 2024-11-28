import os
import subprocess
import time

def modify_file(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()

    with open(file_path, 'w') as file:
        file.write('export default {\n')
        for line in lines:
            file.write('  ' + line)
        file.write('} as const;')

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

# The source file to be translated
source_file = "../en/form.ts"
source_filename = os.path.basename(source_file)

# Loop through each locale
for locale in locales:
    locale_code = locale["locale"]

    if "../" + locale_code + "/" + source_filename == source_file:
        continue

    output_dir = f"./{locale_code}"
    output_file = f"{output_dir}/{source_filename}"

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Change the current working directory to the locale directory
    os.chdir(output_dir)

    # Command to execute
    command = ["chatgpt-md-translator", "-m", "gpt-4o", source_file, "-o", source_filename, "--interval", "0"]

    # Execute the command
    subprocess.run(command)

    modify_file(source_filename)

    # wait 20 seconds
    time.sleep(20)

    # Change back to the original working directory
    os.chdir("..")

print("Translation commands executed successfully.")
