import scrapy


class TripspiderSpider(scrapy.Spider):
    name = "tripspider"
    allowed_domains = ["www.tripadvisor.com"]
    start_urls = ["https://www.tripadvisor.com/Hotel_Review-g297930-d19819026-Reviews-Four_Points_by_Sheraton_Phuket_Patong_Beach_Resort-Patong_Kathu_Phuket.html"]

    def parse(self, response):
        pass
