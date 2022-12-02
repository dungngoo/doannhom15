# Backend_database
-----------Socket client-------------------
- Authentication

    + on:       User-Auth

                data:   
                {
                    "token": ""
                }

- Send friend request

    + on:       User-Send-Request

                data:
                {
                    "token": "",
                    "receiverId": ""
                }

- Refuse Request

    + on:       User-Refuse-Request

                data:
                {
                    "requestId": "",
                    "token": ""
                }

- Accept Request

    + on:       User-Accept-Request

                data:
                {
                    "requestId": "",
                    "token": ""
                }

- Remove Friend

    + on:       User-Remove-Friend

                data:
                {
                    "token": "",
                    "friendId": ""
                }

- Send Message

    + on:       User-Send-Message

                data:{
                    "message":{
                        "type": "",
                        "content": "",
                        "chat": "63522459c451417dd9e643f3"
                    },
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTIyMTRlYzQ1MTQxN2RkOWU2NDNjNCIsImlhdCI6MTY2NjMyNjkzNiwiZXhwIjoxNjY3MTkwOTM2fQ.GdY3VVGj7OA8ckpNi3fv2hFM9zm4-6E7vjKHFmuJM1o"
                }

emit:
    + Success
    + Error


------------------------------------------------------------------------------------------------------
functionType: 

    + 1: Authentication: statuscode:
        + 200: thanh cong
        + 500: that bai, token khong hop le
        + 404: chưa auth

    + 2: send request: statusCode:
        + 200: thanh cong
        + 500: that bai 

    + 3: accept request: statusCode:
        + 200: thanh cong
        + 500: that bai

    + 4: refuse request: statucCode:
        + 200: thanh cong
        + 500: that bai

    + 5: remove friend
        +200: thanh cong
        +500 that bai

    + 6: send message
        +200 thanh cong
        +200 that bai

    + 7: add friend
        +200 thanh cong

    + 8: removeRequest
        +200 thanh cong

    +9: add Chat 
        +200 thanh cong