export const twoFACodeTemplate = (CODE: string) => {
  return `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Two-Factor Authentication Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td align="center" style="padding: 50px 0 50px 0;">
            <!-- Main Table -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <tr>
            <td align="center" style="padding: 40px 0 30px 0;">
                <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="54" height="54" fill="url(#pattern0)"/>
                    <defs>
                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlink:href="#image0_1_39" transform="scale(0.0116279)"/>
                    </pattern>
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
                                    Two-Factor Authentication Code
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px 0 30px 0; color: #666666; font-size: 16px; line-height: 20px; text-align: center;">
                                    Please enter the following code to verify your identity:
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="color: #3498db; font-size: 24px; padding: 20px 0;">
                                    ${CODE}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top: 30px; color: #777777; font-size: 14px; line-height: 20px; text-align: center;">
                                    If you did not request this code, please ignore this email.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <!-- Footer Section -->
                <tr>
                    <td bgcolor="#f4f4f4" align="center" style="padding: 30px 30px;">
                        &copy; 2023 TrussdID. All rights reserved.
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
