import scrapy
from quotescraper.items import quoteItem


class QuotespiderSpider(scrapy.Spider):
    name = "quotespider"
    allowed_domains = ["quotes.toscrape.com"]
    start_urls = ["http://quotes.toscrape.com/"]

    def parse(self, response):
        quotes = response.css('div.quote')

        for quote in quotes:
            yield{
                'quote' : quote.css('.text::text').get(),
                'author' : quote.css('small.author::text').get(),
            }
            # quote_item = quoteItem()
            # quote_item['quote'] = quote.css('div.quote::text')
            # quote_item['author'] = quote.css('small.quthor::text')
            # print('a book done')
        
        next_page = response.xpath("//li[@class='next']/a/@href").get() 
        #or response.css('li.next a::attr(href)').get()
        if next_page is not None:
            next_page_url = "https://quotes.toscrape.com" + next_page
            yield response.follow(next_page_url, callback = self.parse)
        pass