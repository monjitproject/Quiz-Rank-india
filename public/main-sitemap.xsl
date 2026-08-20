<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - JobsNews Online</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05), 0 0 0 1px rgb(0 0 0 / 0.02);
            padding: 40px;
            border: 1px solid #f1f5f9;
          }
          .header {
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 24px;
            margin-bottom: 32px;
          }
          h1 {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.03em;
            margin: 0 0 8px 0;
            color: #0f172a;
          }
          p.subtitle {
            font-size: 14px;
            color: #64748b;
            margin: 0;
          }
          p.expl {
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
            margin: 16px 0 0 0;
            background: #f1f5f9;
            padding: 12px 20px;
            border-radius: 12px;
            display: inline-block;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 13px;
          }
          th {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
            border-bottom: 2px solid #f1f5f9;
            padding: 12px 16px;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
            word-break: break-all;
          }
          a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
          }
          a:hover {
            text-decoration: underline;
          }
          .badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            font-family: monospace;
          }
          .badge-high {
            background-color: #ef4444;
            color: #ffffff;
          }
          .badge-med {
            background-color: #3b82f6;
            color: #ffffff;
          }
          .badge-low {
            background-color: #64748b;
            color: #ffffff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>XML Sitemap</h1>
            <p class="subtitle">Generated dynamically by JobsNews Online Editorial &amp; SEO Engine.</p>
            <p class="expl">
              This XML Sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs for crawlers (Google, Bing, Yahoo). It is updated automatically in real-time.
            </p>
          </div>
          <table>
            <thead>
              <tr>
                <th width="60%">URL (Location)</th>
                <th width="15%">Change Freq</th>
                <th width="10%">Priority</th>
                <th width="15%">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <xsl:sort select="sitemap:priority" order="descending"/>
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority &gt;= 0.9">
                        <span class="badge badge-high"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority &gt;= 0.8">
                        <span class="badge badge-med"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="badge badge-low"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
