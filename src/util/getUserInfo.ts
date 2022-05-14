import { Request } from "express";

/**
 * Function to retrieve username and email from the credentials granted
 * by AWS Application Load Balancer.
 *
 * @param {Request} req - The request object.
 * @return {{ name: string; email: string }} - The username and email.
 */
export const getUserInfo = (req: Request): { name: string; email: string } => {
  console.log("getUserInfo is called");
  const oidcData = req.headers["x-amzn-oidc-data"];
  console.log("oidcData is: ", oidcData);
  if (oidcData && typeof oidcData === "string") {
    // JWT形式の文字列からpayloadを取得
    const payload = oidcData.split(".")[1];
    // payloadをdecodeしてjson形式に変換
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));

    // TODO decoded.nameからdecoded.usernameに変換する必要があるかも。
    // TODO ALBが付与するx-amzn-oidc-dataの仕様を確認する
    return { name: decoded.name || "", email: decoded.email || "" };
  } else {
    return { name: "", email: "" };
  }
};
