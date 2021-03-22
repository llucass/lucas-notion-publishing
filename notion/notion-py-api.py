import inspect
import json
import os
import sys

from notion.client import NotionClient

# Obtain the `token_v2` value by inspecting your browser cookies on a logged-in session on Notion.so
client = NotionClient(token_v2=os.environ["c52a54a19827a785658649b49b5b58050cc8e60a20f43738fe36186dd86afcf3a90e60f50d9b5cc3e7dc684763b6aa4d93699ecada98a109fb56fc32c78f529bd23f9762c89dfa6e48db8efe880b"])


# page = client.get_block("https://www.notion.so/lucasng/d5e64eb3d1444755bc47a64d478b36e8?v=3785223a93d04279bf42674fda3539a4")
# space = client.get_space(page.space_info['spaceId'])

# Next step here is to

def serializable(obj):
    try:
        return json.dumps(obj)
    except TypeError:
        return None

def get_block_dict(block):
    blacklist = ["children", "parent"]

    attributes = [a for a in inspect.getmembers(block) if not a[0].startswith('__') and a[0] not in blacklist]
    properties = [a for a in attributes if not callable(a[1]) and serializable(a[1])]

    block_dict = dict(properties)
    if hasattr(block, "children"):
        block_dict["children"] = [get_block_dict(child) for child in block.children]

    return block_dict

# print("The old title is:", page.title)
# pages = []
# for page_id in space.pages:
#     page = client.get_block(page_id)
#     pages.append(get_block_dict(page))
# str = json.dumps(pages)
# print(str)
#
# with open("output.txt", "w") as text_file:
#     text_file.write(str)

# serialized = get_block_dict(page)
# print(serialized)

# Note: You can use Markdown! We convert on-the-fly to Notion's internal formatted text data structure.
# page.title = "The title has now changed, and has *live-updated* in the browser!"