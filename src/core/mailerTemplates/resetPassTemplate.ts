export const resetTemplate = (BUTTON_LINK: string) => {
  return `
     <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td align="center" style="padding: 50px 0 50px 0;">
            <!-- Main Table -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Logo Section -->
                <tr>
                    <td align="center" style="padding: 40px 0 30px 0;">
                        <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="54" height="54" fill="url(#pattern0)"/>
                            <defs>
                            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <use xlink:href="#image0_1_39" transform="scale(0.0116279)"/>
                            </pattern>
                            <image id="image0_1_39" width="86" height="86" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABWCAYAAABVVmH3AAABG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Gkqr6gAAAYFpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/hkGMKBYWFi9hNSM/amKjjISSNEYZbN68eTOj5s283htJtspWUWLj14K/gK2yVopIycbGmtig57yZqZHMOd17P/d7zzndey54ImnNsKt6wMjkrPBYSJmLzis1z3ipEO+iWtVsc3h6epKy9nEnkWI3AbdW+bh/rT6u2xpU1AoPaaaVEx4XnlzJmS5vC7doKTUufCrst+SCwreuHivwi8vJAn+5bEXCI+BpElaSvzj2i7WUZQjLy+kw0sta8T7uS3x6ZnZG1nYZbdiEGSOEwgSjjBCkl0GZgwToo1t2lMnvyedPkZVcTWaTVSyWSJIih1/UZamuy5oQXRdPs+r2/29f7UR/X6G6LwTeJ8d564SaLfjedJzPQ8f5PoLKR7jIlPKzBzDwLvpmSevYh8Z1OLssabEdON+A1gdTtdS8VCnDk0jA6wk0RKH5GuoWCj0rnnN8D5E1+aor2N2DLolvXPwB4Sdnqc5aonQAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAt7SURBVHic7Zx7tBVVHcc/F6RwIEERA58gpKJZ9EAR3zhKmRO+LUrBlpqySo0p16S0atnSNWKTqMuWgmUseaglhgNhrjENXZKZz9QFoYgPDDU0DEdS4PbHby6cO3dmz2/OOffec8DvWmede/bs/dv7fO8+e//277FbaHBYbtgTGAgMAt6IA+etbh6SCjt09wAALDfsBRwJjAX2AAYjRA5CSO2RVD0D+H13jLEsuo1Yyw13Ar4CfB34GtBf0Wxzpw6qjuhSYi03HACcCYxHZmevkiI21X1QnYQuIdZyQwu4BPCAnWoQ9fGMhS0bz0TgSmTtrBXbN7GWG7Yg66YPHFRH0dsvsZYb7gPMAo6ut2y21zXWcsPDgXsQFakz0DQztkdxFR0sN5wEPEjnkQpNRGzNMzbZoHzgh7UPx4h1QNzJfdQNLbU0TpT8ecCJ9RkO64HFwF+A1cCa5PVmHDgf1KmPLkHVxFpu2B9YAhxc4xhWA/cCC4CH4sD5X43yGgJVLQXJz/8OaiP1MeDHCJmtNchpSFS7xk4DxlXZdgVC6PxtkdA2lF4Kkt3/tir6ehv4KXBrHDgfVdG+qVCKWMsNDwMeAj5Rsp/HgFPiwPlXyXZNC7Uea7nhXojyX5bU2cAxTU9q5I0i8oZqq6vW2OTsPw/4dImhtCJr6bSmXksjrwWxzE0D7kPsx4VQLQWWG55GOcv9RuCMOHD+UKJN4yHydkH2k0oyHWx/YVHTQmITt8nzwGdKDOnCOHBuKVG/8RB5YxCVcq/Uk5XAQdj+BlNzzVJwHuVIvampSY28Hsjx/GqgZ0aNfYHLEBtzLowz1nLDvsCL6NfWB4FxTatORd5AxOT51YKaG4AR2P6qvApFWsEU9KSuRNbV5iRVcDfFpAL0Rja0XOQSa7nhbsCPSgzq3Dhw1pao34i4tkTdSUTejnkPTWvsRUBfZScL48BZYqpgueGhwFXAMOAfwGVx4CwrEmy5YW9gJDCUYh16HfA68Brwdhw45ey3th8SeQuBkxS1+yMe51lZD03EnqIczmZEX82F5YZ7I6bATyZFQ4AxlhsOiwNnnaHdocCdwD7KsVTiI8sNVwPLgduBu+PAMe7kCS4Bjq8YqwkXkkNs5lJgueFQ4PMKwQCz4sB5rqDOBXQc6ADg23kNkkPJTKojFSRmYQhiLJoNvGK5YbFyb/srgenKPkYTeSOzHuStseOVgjcghpUi7JdTblLjBlK7rbcSuwELLDe8PvmnmfAr9G6g87MK84g9WSl0Thw4rynq5YUP7Wxos7dyDGVxMaKj5sP2X0U8GRqckFXYgVjLDQciAWoazFfWqwamjeopYGnF6yngnRKyPcsNJxfUuVkpaziRNyhdmLV5nYTO6rUe+LOy83rj1DhwVqULLTfsh2gPQ5G4hsnkx4dNt9xwURw4r+Q8X4xoF+kjbRaOIGVLySJQZb0BFit32S5DHDjr4sB5Og6ce+LAuRQ4EJnNWegF/CRXmO1vQqxZGnT4hWcRe6BSWMNbruLAeRHZiPOClSdZbmjaQB9WdnVEuqAdscluuadC0Ebgj8pOuxXJ5jox53FPYIKh+SPKbkYSeZ+qLEjP2H6ApRC0Kg6c/yg7bQTcj6yXWTjO0G4V4p4vQg9Sa3GaWM1sBTk2Ng2So+3cnMejLTfsk/nE9luBx5Xd7Fr5IU2sNoZV819sNNybU94LOMTQbo1SvpHYbXLGJjBNhg56aAXeVsrfbmesiaABhmf/VspvF2VZ7YxtOmLjwImRQ00W6kGsccZq0axegjwTpSkVaqNSdrtTbJrYd5VCTMaThoTlhjuQ72YyfW/T+luJdgEpaWK1hoymIxaxluUZ9k07f12I1c7YXZT1GgnDDc/qQWw7GdXOWNNi36gYZnhmInawUn5dZuznlPUaCd06YzXeAIBRlhuWjTrsbhyWU/4Sed878nohkS9F2ExKT04TuwLdctAbvbOx25Hkn+URO9cQDXk4utzfNxP77Ra0IzbpYKlCEMAYZb1uRaJmXWWokmecAXCU3axIF2QdELTEjlXW6zYk9uUbyE8/fbIgaERL7KJ0QRaxjyqFnWi5oXZh73JYbjgMSXG6yFAtP2Iw8vZHH2UZpguyFObHkWTgrBDGdNuJwDXKzuuJ8y03rNwLWhDz347I4WU08AXM3+HaOHAWGJ5rZ+tKoMOs70BsHDjrLTf8G/mLfSXOs9yws0LhTZmIl9coe4lRhmgDFyhlhYlBvB3yjDDadKPhwLGKeh/mlJuyEDvLgvZP4Btx4JiMK5OoYRmAfGLvAN5XCr7acsMiK9mqkuUg5rr3lGPQoBW4DhhpzOCR0ExN2BTI+DI9uZmExIHzX4RcDQ7FENyWICtiZjP57pI2P1VmXFRJvId8l6PiwJmiSHaejN7gfx+2n/lrzA0OS0Io/6rsYA2wX/IPyZN3JTA16fMjwI0D58YiwRXK/ZcpvkJqA7A2eb0D/B1YEgdO3lLUHpG3E7IZaW0hh2P7mVqUidgW4Fngs8pOrooDZ6qpQhIXti+wvCHd55F3C/pNayG2n6s5FCV3nAv8RtHJg8DZceA0nctmCyLvfGCGsnYrMBLbfzavQtGmMwv5OeVhE3AFcHyTkzoGuKlEi3kmUkGXQHcY2aexVcCEOHC0R+DGROTtDjyB3jy4ETgA23/JVKnQmZgQd3uq+E5EbWl2UvsiKUhljua3FpEKei+th+i1MfAd4JumpIymQOTtieigo0u0ioGfayqq7yuw3HAC8EQcOMtLDKQxEXlfRE5Mu5dsOQHbn6epWNMtRk2JyBuP2GA1UZWV+AW2r04obIiLebsEkdcHyUe7nPITKqIgly2NbX/GRl5P4BzEi6D1uFbiZWAUtl8qnbX9jI28/RBr+xxsv2luZctF5B0HBFTvn/sAOKUsqdBxKbgZMQNuQnfiajxIatDJwFnAMTVKOxfbf6aahmliD0jeR9Q2ni5G5A0BTk1eY6h9ifsAOBvbv7taAc21eUXeOUh+7B5IyOkeyWtXQ6uyWIPc+2I6yheiHLFyUlkCPIrtfy/17HfIFxyLJLDdj/jDliIplqOAF4Crsf0HkjYTgZ8BE7H9JUnZcMTreRe2n87DupHa7vguwjMIqdrAlVyUjY/dGXHSTSbytmZlR94I4HTkXoEW4CgkVmoKkk5/AnJsHAssIPLacsl6IzPwTiJvQOJrugNJatYGQdcLi4Aj60EqlCVWOn0aIe/UiidnJe8Lsf3NbE2zPABJtBuArH3rgT4V9WchNyQNQjKuLwO+hLhlsvTGzrq/6zpgPLafa6gvi2oiutsuPjitouz05H12qm4rcDG2/z62vxT5qUFbALBcsfQtxKNwJlv9/Odh+1mBavUm9mHgEGx/SjpEqFZUQ+xcxHQ2hsgbnCwDBwFvAg+k6q7F9iudki8n71sTh0WduaFiPAuxfZO/vx54CZkYR2P72jyuUihPrO2/haR7tiD6YttsnYftp13KafdLx1khqZJnVJQcm6hPWah1xr4L/AA4ENufnxUPUC9Um9zx2+T9NLaSkl4GQEeEj4Sxv4yk6fcBZiZ3ClYjLwuvIhrKcGx/ep5ntZ7IU7fGEXn9UmUxMBPbfx7ZQdciu3wLEmLzZOneI+9IxN0M4upeCTwH2ECWv60MscsRI/Z84MnOnJ1ZSBO7DDFUHEz2fSz9gUnY/odE3lzg+0n57NTA2yLD07G276beveR9RoVuOxX4JXAFkXdbCUJakc1RyLT9F5TtOgVpYr+L7M5ZSngMzKn4vJitxKZjTO9HwpTSgRozkQy+Xyef70JOOpdW1LkeuRjnwwxSH0E8GauT1+sVf6/B9hsm/6z6M3XkzUB+vg9h+5r4re0KZY+0Q5ELvyzklk6QGfYxUihrhNmf9pclzsAQf7U9oyyxf0LO8XsBy7D9N+o/pG0D/we62RG4CWFn0wAAAABJRU5ErkJggg=="/>
                            </defs>
                        </svg>
                    </td>
                </tr>
                <!-- Content Section -->
                <tr>
                    <td align="center" style="padding: 40px 30px 40px 30px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="color: #333333; font-size: 24px; padding-bottom: 10px; text-align: center;">
                                    Password Reset Request
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px 0 30px 0; color: #666666; font-size: 16px; line-height: 20px; text-align: center;">
                                    You're receiving this email because we received a password reset request for your account.
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <a href="${BUTTON_LINK}" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-shadow: 0 2px 3px rgba(0,0,0,0.1); padding: 10px 20px; font-size: 18px; text-decoration: none;">Reset Password</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top: 30px; color: #777777; font-size: 14px; line-height: 20px; text-align: center;">
                                    If you did not request a password reset, no further action is required.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <!-- Footer Section -->
                <tr>
                    <td bgcolor="#f4f4f4" align="center" style="padding: 30px 30px;">
                        &copy; 2023 idlynx. All rights reserved.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</body>
</html>
     `;
};
