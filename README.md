# Rights Encoder

DB folder includes *.json files which simulate our database. Each json file has 'view' and 'edit' arrays of strings. The main task is to compress each array to the nested JSON by removing dublicating parts and to flatten them back.

To test for equality run:
## node test.js