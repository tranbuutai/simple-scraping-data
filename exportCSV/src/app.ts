import axios from "axios";
import cheerio from "cheerio";
import { writeFileSync } from "fs";
const json2csv = require("json2csv").Parser;

const url: string =
  "http://books.toscrape.com/catalogue/category/books/mystery_3/";
const booksData: Array<any> = [];

const getData = async (url: string) => {
  try {
    const res = await axios.get(url, {
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
    });
    const $ = cheerio.load(
      res.data,
      {
        xml: {
          xmlMode: true,
          decodeEntities: true, // Decode HTML entities.
          withStartIndices: false, // Add a `startIndex` property to nodes.
          withEndIndices: false, // Add an `endIndex` property to nodes.
        },
      },
      false
    );
    const books = $("article");
    books.each(function () {
      const title = $(this).find("h3 a").text();
      const price = $(this).find(".price_color").text();
      const status = $(this).find(".instock.availability").text().trim();

      booksData.push({ title, price, status });
    });

    if ($(".next a").length > 0) {
      const nextUrl = url + $(".next a").attr("href");
      getData(nextUrl);
    } else {
      const parser = new json2csv();
      const csv = parser.parse(booksData);
      writeFileSync("./books.csv", csv);
      // console.log(booksData);
    }
  } catch (error) {
    console.log(error);
  }
};

getData(url);
