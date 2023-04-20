from fastapi import FastAPI
import re
import requests
from bs4 import BeautifulSoup
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/province")
async def get_temple(province: str):
    if province == "กรุงเทพมหานคร" or province == "กรุงเทพ":
        url = "https://th.wikipedia.org/wiki/รายชื่อวัดในกรุงเทพมหานคร"
    else:
        url = "https://th.wikipedia.org/wiki/รายชื่อวัดในจังหวัด" + province
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    text = soup.get_text()
    patten = re.compile(r"(วัด.*) (?:ตำบล|แขวง)")
    results = patten.findall(text)
    listtemple = []

    for result in results:
        pattern2 = re.compile("วัด\S+")
        results2 = pattern2.search(result).group()
        if results2 not in listtemple:
            listtemple.append(results2)
    dict = {"province": province, "temple": listtemple}
    print("number of temple in " + province + " is " + str(len(listtemple)))

    return JSONResponse(content=jsonable_encoder(dict))
