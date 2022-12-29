import { Context, APIGatewayProxyResult } from "aws-lambda";
import cheerio, { CheerioAPI } from "cheerio";
import axios, { AxiosResponse } from "axios";

interface Props {
  event: {
    url: string;
    type?: any;
    data: {
      field: {
        FullName: string;
        CardNumber: string;
        IssueNumber: string;
        ExpiryDate$selDay: string;
        ExpiryDate$selMonth: string;
        ExpiryDate$selYear: string;
      };
    };
  };
}

export const handler = async (
  event: Props["event"],
  context: Context
): Promise<APIGatewayProxyResult> => {
  const { url, type, data } = event;
  const res: AxiosResponse<any, any> = await axios.post(
    // https://www.bluecard.qld.gov.au/onlinevalidation/validationNoNav.aspx
    url,
    new URLSearchParams({
      __EVENTTARGET: "",
      __EVENTARGUMENT: "",
      __VIEWSTATE: "",
      __VIEWSTATEGENERATOR: "42F30890",
      __EVENTVALIDATION: "/",
      FullName: data.field.FullName,
      CardNumber: data.field.CardNumber,
      IssueNumber: data.field.IssueNumber,
      ExpiryDate$selDay: data.field.ExpiryDate$selDay,
      ExpiryDate$selMonth: data.field.ExpiryDate$selMonth,
      ExpiryDate$selYear: data.field.ExpiryDate$selYear,
      ValidateCardBtn: "Validate Card",
    })
  );
  const $: CheerioAPI = cheerio.load(
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
  const result = $("#ResultMessages strong").text();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result,
    }),
  };
};
