import json
import bcrypt

# Specify the path to your fixture file
fixture_file_path = 'User_fixture.json'

# Define a function to hash passwords
def hash_password(plaintext_password):
    return bcrypt.hashpw(plaintext_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Load the fixture file
with open(fixture_file_path, 'r') as fixture_file:
    data = json.load(fixture_file)

# Apply bcrypt hashing to passwords
for item in data:
    if 'fields' in item and 'user_Password' in item['fields']:
        # Retrieve the placeholder password from the fixture data
        placeholder_password = item['fields']['user_Password']

        # Hash the password
        hashed_password = hash_password(placeholder_password)

        # Update the fixture data with the hashed password
        item['fields']['user_Password'] = hashed_password

# Save the updated fixture file
with open(fixture_file_path, 'w') as fixture_file:
    json.dump(data, fixture_file, indent=4)

print(f"Passwords in '{fixture_file_path}' have been hashed and updated.")
