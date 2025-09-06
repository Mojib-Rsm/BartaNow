
export function getNewCommentEmailHtml({ comment, article }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bartanow.com';
    const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "https://www.bartanow.com/log-heado.png";
    const moderationUrl = `${siteUrl}/admin/comments`;
    const yearInBangla = new Intl.NumberFormat('bn-BD').format(new Date().getFullYear());

    return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>নতুন মন্তব্য পাওয়া গেছে</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                background-color: #f9fafb;
                color: #212529;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #212529;
                padding: 20px;
                text-align: center;
            }
            .header img {
                max-width: 150px;
            }
            .content {
                padding: 30px;
            }
            .content h1 {
                color: #007bff;
                font-size: 24px;
            }
            .content p {
                font-size: 16px;
                line-height: 1.6;
            }
            .comment-box {
                border-left: 4px solid #e9ecef;
                padding-left: 15px;
                margin: 20px 0;
                font-style: italic;
                color: #495057;
            }
            .button {
                display: inline-block;
                margin: 20px 0;
                padding: 12px 25px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
            }
            .footer {
                background-color: #e9ecef;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6c757d;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="${siteUrl}"><img src="${logoUrl}" alt="BartaNow Logo"></a>
            </div>
            <div class="content">
                <h1>নতুন মন্তব্য পাওয়া গেছে</h1>
                <p><strong>${comment.userName}</strong> এই আর্টিকেলটিতে একটি নতুন মন্তব্য করেছেন:</p>
                <p><a href="${siteUrl}/${article.slug}" target="_blank"><strong>${article.title}</strong></a></p>
                <div class="comment-box">
                    <p>"${comment.text}"</p>
                </div>
                <a href="${moderationUrl}" class="button">মন্তব্য মডারেট করুন</a>
            </div>
            <div class="footer">
                <p>&copy; ${yearInBangla} বার্তা নাও। সর্বসত্ত্ব সংরক্ষিত।</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
