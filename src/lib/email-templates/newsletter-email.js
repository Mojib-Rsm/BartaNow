
export function getNewsletterHtml({ articles, customMessage }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
    const logoUrl = "https://raw.githubusercontent.com/Mojib-Rsm/BartaNow/refs/heads/main/public/log-heado.png";
    const yearInBangla = new Intl.NumberFormat('bn-BD').format(new Date().getFullYear());

    return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>বার্তা নাও নিউজলেটার</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
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
            .custom-message {
                padding: 15px;
                background-color: #e9ecef;
                border-left: 4px solid #007bff;
                margin-bottom: 25px;
                font-style: italic;
            }
            .article {
                margin-bottom: 25px;
                padding-bottom: 25px;
                border-bottom: 1px solid #e0e0e0;
            }
            .article:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            .article-image {
                width: 100%;
                height: auto;
                border-radius: 4px;
                margin-bottom: 15px;
            }
            .article-title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .article-title a {
                color: #007bff;
                text-decoration: none;
            }
            .article-summary {
                font-size: 16px;
                line-height: 1.6;
                color: #6c757d;
            }
            .read-more {
                display: inline-block;
                margin-top: 15px;
                padding: 10px 15px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 14px;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6c757d;
            }
            .footer a {
                color: #007bff;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="${siteUrl}"><img src="${logoUrl}" alt="BartaNow Logo"></a>
            </div>
            <div class="content">
                ${customMessage ? `<div class="custom-message">${customMessage}</div>` : ''}

                ${articles.map(article => `
                    <div class="article">
                        <a href="${siteUrl}/${article.slug}" target="_blank">
                            <img src="${article.imageUrl}" alt="${article.title}" class="article-image">
                        </a>
                        <div class="article-title">
                            <a href="${siteUrl}/${article.slug}" target="_blank">${article.title}</a>
                        </div>
                        <p class="article-summary">${article.aiSummary}</p>
                        <a href="${siteUrl}/${article.slug}" target="_blank" class="read-more">বিস্তারিত পড়ুন</a>
                    </div>
                `).join('')}
            </div>
            <div class="footer">
                <p>&copy; ${yearInBangla} বার্তা নাও। সর্বসত্ত্ব সংরক্ষিত।</p>
                <p>আপনি এই ইমেইলটি পাচ্ছেন কারণ আপনি আমাদের নিউজলেটারে সাবস্ক্রাইব করেছেন।</p>
                <p><a href="${siteUrl}/unsubscribe" target="_blank">আনসাবস্ক্রাইব করুন</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
}

    