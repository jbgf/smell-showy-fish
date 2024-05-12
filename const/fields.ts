import { averageRating } from "~contents/const/average-rating";
import { categories } from "~contents/const/categories";
import { feature } from "~contents/const/feature";
import { featuredImage } from "~contents/const/featured-image";
import { FullAddress } from "~contents/const/full-address";
import { latitude } from "~contents/const/latitude";
import { longitude } from "~contents/const/longitude";
import { municipality } from "~contents/const/municipality";
import { name } from "~contents/const/name";
import { openingHours } from "~contents/const/opening-hours";
import { phone } from "~contents/const/phone";
import { reviewCount } from "~contents/const/review-count";
import { reviewURL } from "~contents/const/review-url";
import { street } from "~contents/const/street";
import { website } from "~contents/const/website";

export const fields = [
  {
      label: `Name`,
      path: name,
  },
  {
      label: `Feature`,
      path: feature,
  
  },
  {
      label: `Full Address`,
      path: FullAddress
  },
  {
      label: `Street`,
      path: street
  },
  {
      label: `Municipality`,
      path: municipality
  },
  {
      label: `Categories`,
      path: categories
  },
  {
      label: `Phone`,
      path: phone
  },
  {
      label: `Review Count`,
      path: reviewCount
  },
  {
      label: `Average Rating`,
      path: averageRating
  },
  {
      label: `Review URL`,
      path: reviewURL
  },
  {
      label: `Latitude`,
      path: latitude
  },
  {
      label: `Longitude`,
      path: longitude
  },
  {
      label: `Website`,
      path: website
  },
  {
      label: `Featured Image`,
      path: featuredImage,
  },
  {
      label: `Opening Hours`,
      path: openingHours,
      formatArray: (arr) => arr?.map((item) => `${item?.[0]}: ${item?.[1]?.toString()}`)?.join(',')
  },
]