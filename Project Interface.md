## Article

BaseURL: /api/articles
\### Get Article List

**URL**: http://localhost:8080/api/articles
**Method**: GET
\*\*Request Sample: http://localhost:8080/api/articles?categoryId=1
Return Sample:

``` json
{
  "code": "200",
  "msg": "操作成功",
  "data": {
    "total": 2,
    "list": [
      {
        "id": 30,
        "title": "Understanding Product Descriptions",
        "content": "Guide on how to read and interpret product descriptions.",
        "summary": "Product description overview.",
        "categoryId": 1,
        "categoryName": "General",
        "authorId": 2,
        "authorName": "jane_smith",
        "authorAvatar": null,
        "status": "published",
        "viewCount": 0,
        "likeCount": 0,
        "commentCount": 0,
        "isTop": 0,
        "createdAt": "2025-05-25T02:24:14",
        "updatedAt": "2025-05-25T02:24:14",
        "tags": null
      }
}
```

### Get Article Detail

**URL**: http://localhost:8080/api/articles/{id}
**Method**: GET
\*\*Request Sample: http://localhost:8080/api/articles/1
Return Sample:

``` json
{
  "code": "200",
  "msg": "操作成功",
  "data": {
    "id": 1,
    "title": "How to Track Your Order",
    "content": "Detailed instructions on tracking orders through our website.",
    "summary": "Order tracking guide.",
    "categoryId": 3,
    "categoryName": "Shipping Information",
    "authorId": 1,
    "authorName": "john_doe",
    "authorAvatar": null,
    "status": "published",
    "viewCount": 0,
    "likeCount": 0,
    "commentCount": 0,
    "isTop": 0,
    "createdAt": "2025-05-25T02:15:45",
    "updatedAt": "2025-05-25T02:15:45",
    "tags": null
  }
}
```

### Create Article

**URL**: http://localhost:8080/api/articles
**Method**: POST
\*\*Request Sample: http://localhost:8080/api/articles
Request Body:

``` json
{

  "title": "testTitle",

  "content": "testContent",

  "summary": "testSummary",

  "categoryId": 1,

  "tag_ids": [1],

  "authorId": 13,

  "status": "published"

}
```

**Return Sample:**

``` json
{

    "code": "200",

    "msg": "操作成功",

    "data": {

        "id": 37,

        "title": "testTitle",

        "content": "testContent",

        "summary": "testSummary",

        "categoryId": 1,

        "authorId": 13,

        "status": "published",

        "viewCount": 0,

        "likeCount": 0,

        "commentCount": 0,

        "isTop": 0,

        "createdAt": "2025-05-25T15:06:47.6671329",

        "updatedAt": "2025-05-25T15:06:47.6671329"

    }

}
```

### Update Article

**URL**: http://localhost:8080/api/articles/{id}
**Method**: PUT
\*\*Request Sample: http://localhost:8080/api/articles/1
Request Body:

``` json
{
  "title": "更新后的文章标题",
  "content": "更新后的文章内容。",
  "summary": "更新后的文章摘要。",
  "categoryId": 4,
  "tag_ids": [4, 5],
  "status": "published"
}
```

Return Sample\*\*

``` json
{

    "code": "200",

    "msg": "操作成功",

    "data": {

        "id": 1,

        "title": "更新后的文章标题",

        "content": "更新后的文章内容。",

        "summary": "更新后的文章摘要。",

        "categoryId": 4,

        "authorId": 1,

        "status": "published",

        "viewCount": 0,

        "likeCount": 0,

        "commentCount": 0,

        "isTop": 0,

        "createdAt": "2025-05-25T02:15:45",

        "updatedAt": "2025-05-25T15:11:15.3302275"

    }

}
```

### Delete Article

**URL**: http://localhost:8080/api/articles/{id}
**Method**: DELETE
**Request Sample: http://localhost:8080/api/articles/1
Return Sample**

``` json
{

    "code": "200",

    "msg": "操作成功",

    "data": null

}
```

### Like Article

**URL**: http://localhost:8080/api/articles/{id}/like
**Method**: POST
**Request Sample: http://localhost:8080/api/articles/2/like
Return Sample**

``` json
{

    "code": "200",

    "msg": "操作成功",

    "data": {

        "message": "点赞成功",

        "likeCount": 1

    }

}
```

### Add Article View

**URL**: http://localhost:8080/api/articles/{id}/view
**Method**: POST
**Request Sample: http://localhost:8080/api/articles/2/view  
Return Sample**

``` json
{

    "code": "200",

    "msg": "操作成功",

    "data": {
        "message": "浏览记录成功",
        "viewCount": 1
    }
}
```

## Chat

**URL**: http://localhost:8080/ai/chat
**Method**: GET
**Request Sample: http://localhost:8080/ai/chat?msg=你好
Return Sample**

``` json
哎哟，这不是老街坊吗？今儿个天气不错啊！我正琢磨着去前门那边溜达溜达呢。您这是去哪儿啊？要不咱俩一块儿走？这年头能碰上熟人不容易啊。对了，您最近过得咋样？
```

## Comment

BaseURL: /api/articles

### Get Comment

**URL**: http://localhost:8080/api/articles/{article_id}/comments?page=1&page_size=20
**Method**: GET
\*\*Request Sample: http://localhost:8080/api/articles/2/comments?page=1&page_size=20
Return Sample

``` json
{
  "code": "200",
  "msg": "操作成功",
  "data": {
    "records": [],
    "total": 0,
    "size": 10,
    "current": 1,
    "pages": 0
  }
}
```

### Post Comment

**URL**: http://localhost:8080/api/articles/{article_id}/comments
**Method**: POST
\*\*Request Sample: http://localhost:8080/api/articles/2/comments
Return Sample

``` json
{

    "code": "200",

    "msg": "操作成功",

    "data": {

        "id": 16,

        "articleId": 2,

        "userId": 13,

        "content": "nice。",

        "parentId": null,

        "status": "approved",

        "createdAt": "2025-05-25T15:40:13.8393526",

        "updatedAt": "2025-05-25T15:40:13.8393526"

    }

}
```

### Delete Comment

**URL**: http://localhost:8080/api/comments/{id}
**Method**: DELETE
**Request Sample: http://localhost:8080/api/comments/1
Return Sample**

``` json
{

    "code": "200",

    "msg": "操作成功",

    "data": null

}
```

## Category

### Get Categories

**URL**: <http://localhost:8080/api/categories?page=1&page_size=20>  
**Method**: GET  
**Request Sample**: <http://localhost:8080/api/categories?page=1&page_size=20>  
**Return Sample**:

json

复制

    {
      "total": 16,
      "list": [
        {
          "id": 1,
          "name": "General",
          "description": "General knowledge about products",
          "parentId": null,
          "sortOrder": 1,
          "createdAt": "2025-05-25T02:15:41",
          "updatedAt": "2025-05-25T02:15:41"
        },
        {
          "id": 11,
          "name": "Customer Service",
          "description": "Information on customer service policies",
          "parentId": null,
          "sortOrder": 1,
          "createdAt": "2025-05-25T02:20:55",
          "updatedAt": "2025-05-25T02:20:55"
        },
        {
          "id": 20,
          "name": "Warranty Information",
          "description": "Information about product warranties",
          "parentId": null,
          "sortOrder": 1,
          "createdAt": "2025-05-25T02:18:41",
          "updatedAt": "2025-05-25T02:18:41"
        },
        {
          "id": 2,
          "name": "Technical Support",
          "description": "Technical issues and solutions",
          "parentId": null,
          "sortOrder": 2,
          "createdAt": "2025-05-25T02:15:41",
          "updatedAt": "2025-05-25T02:15:41"
        },
        {
          "id": 12,
          "name": "Product Comparisons",
          "description": "Comparing different products",
          "parentId": null,
          "sortOrder": 2,
          "createdAt": "2025-05-25T02:20:55",
          "updatedAt": "2025-05-25T02:20:55"
        },
        {
          "id": 2000,
          "name": "Product Features",
          "description": "Detailed features of our products",
          "parentId": null,
          "sortOrder": 2,
          "createdAt": "2025-05-25T02:18:41",
          "updatedAt": "2025-05-25T02:18:41"
        },
        {
          "id": 3,
          "name": "Shipping Information",
          "description": "Shipping and delivery details",
          "parentId": null,
          "sortOrder": 3,
          "createdAt": "2025-05-25T02:15:41",
          "updatedAt": "2025-05-25T02:15:41"
        },
        {
          "id": 7,
          "name": "Customer Feedback",
          "description": "Customer reviews and feedback",
          "parentId": null,
          "sortOrder": 3,
          "createdAt": "2025-05-25T02:18:41",
          "updatedAt": "2025-05-25T02:18:41"
        },
        {
          "id": 13,
          "name": "User Guides",
          "description": "Guides for using our products",
          "parentId": null,
          "sortOrder": 3,
          "createdAt": "2025-05-25T02:20:55",
          "updatedAt": "2025-05-25T02:20:55"
        },
        {
          "id": 4,
          "name": "Returns",
          "description": "Information on returns and exchanges",
          "parentId": null,
          "sortOrder": 4,
          "createdAt": "2025-05-25T02:15:41",
          "updatedAt": "2025-05-25T02:15:41"
        },
        {
          "id": 8,
          "name": "Troubleshooting",
          "description": "Guidelines for troubleshooting issues",
          "parentId": null,
          "sortOrder": 4,
          "createdAt": "2025-05-25T02:18:41",
          "updatedAt": "2025-05-25T02:18:41"
        },
        {
          "id": 14,
          "name": "Updates",
          "description": "Latest updates and announcements",
          "parentId": null,
          "sortOrder": 4,
          "createdAt": "2025-05-25T02:20:55",
          "updatedAt": "2025-05-25T02:20:55"
        },
        {
          "id": 5,
          "name": "Payment Issues",
          "description": "Troubleshooting payment-related issues",
          "parentId": null,
          "sortOrder": 5,
          "createdAt": "2025-05-25T02:15:41",
          "updatedAt": "2025-05-25T02:15:41"
        },
        {
          "id": 9,
          "name": "Promotions",
          "description": "Current promotions and discounts",
          "parentId": null,
          "sortOrder": 5,
          "createdAt": "2025-05-25T02:18:41",
          "updatedAt": "2025-05-25T02:18:41"
        },
        {
          "id": 6,
          "name": "Account Management",
          "description": "Managing your account information",
          "parentId": null,
          "sortOrder": 6,
          "createdAt": "2025-05-25T02:15:41",
          "updatedAt": "2025-05-25T02:15:41"
        },
        {
          "id": 10,
          "name": "FAQs",
          "description": "Frequently asked questions",
          "parentId": null,
          "sortOrder": 6,
          "createdAt": "2025-05-25T02:18:41",
          "updatedAt": "2025-05-25T02:18:41"
        }
      ],
      "pageNum": 1,
      "pageSize": 20,
      "size": 16,
      "startRow": 1,
      "endRow": 16,
      "pages": 1,
      "prePage": 0,
      "nextPage": 0,
      "isFirstPage": true,
      "isLastPage": true,
      "hasPreviousPage": false,
      "hasNextPage": false,
      "navigatePages": 8,
      "navigatepageNums": [1],
      "navigateFirstPage": 1,
      "navigateLastPage": 1
    }

### Get Category

**URL**: <http://localhost:8080/api/categories/%7Bid%7D>  
**Method**: GET  
**Request Sample**: <http://localhost:8080/api/categories/1>  
**Return Sample**:

json

复制

    {
      "code": "200",
      "msg": "操作成功",
      "data": {
        "id": 1,
        "name": "General",
        "description": "General knowledge about products",
        "parentId": null,
        "sortOrder": 1,
        "createdAt": "2025-05-25T02:15:41",
        "updatedAt": "2025-05-25T02:15:41"
      }
    }

### Post Category

**URL**: <http://localhost:8080/api/categories>  
**Method**: POST  
**Request Sample**:

``` json
{
    "name":"test category"
}
```

**Return Sample**:

``` json
{ "code": "200", 
"msg": "操作成功", 
"data": { 
    "id": 10, 
    "name": "新分类",
    "description": "新分类描述",
    "parent_id": null
    } 
}
```

### Put Category

**URL**: <http://localhost:8080/api/categories/%7Bid%7D>  
**Method**: PUT  
**Request Sample**: <http://localhost:8080/api/categories/1>

``` json
{
    "name":"test category"
}
```

**Return Sample**

``` json
{

    "code": "200",

    "msg": "操作成功",

    "data": {

        "id": 1,

        "name": "update category",

        "description": "General knowledge about products",

        "parentId": null,

        "sortOrder": 1,

        "createdAt": "2025-05-25T02:15:41",

        "updatedAt": "2025-05-25T02:15:41"

    }

}
```

## Tag

### Get Tags

**URL**: <http://localhost:8080/api/tags?page=1&page_size=20>  
**Method**: GET  
**Request Sample**: <http://localhost:8080/api/tags?page=1&page_size=20>  
**Return Sample**:

``` json
{
  "code": "200",
  "msg": "操作成功",
  "data": {
    "total": 19,
    "list": [
      {
        "id": 1,
        "name": "Order Issues",
        "createdAt": "2025-05-25T02:15:43",
        "updatedAt": "2025-05-25T02:15:43"
      },
      {
        "id": 2,
        "name": "Product Information",
        "createdAt": "2025-05-25T02:15:43",
        "updatedAt": "2025-05-25T02:15:43"
      },
      {
        "id": 3,
        "name": "Technical Help",
        "createdAt": "2025-05-25T02:15:43",
        "updatedAt": "2025-05-25T02:15:43"
      },
      {
        "id": 4,
        "name": "Shipping",
        "createdAt": "2025-05-25T02:15:43",
        "updatedAt": "2025-05-25T02:15:43"
      },
      {
        "id": 5,
        "name": "Returns",
        "createdAt": "2025-05-25T02:15:43",
        "updatedAt": "2025-05-25T02:15:43"
      },
      {
        "id": 6,
        "name": "Payment",
        "createdAt": "2025-05-25T02:15:43",
        "updatedAt": "2025-05-25T02:15:43"
      },
      {
        "id": 7,
        "name": "Account",
        "createdAt": "2025-05-25T02:15:43",
        "updatedAt": "2025-05-25T02:15:43"
      },
      {
        "id": 8,
        "name": "Warranty",
        "createdAt": "2025-05-25T02:18:51",
        "updatedAt": "2025-05-25T02:18:51"
      },
      {
        "id": 9,
        "name": "Features",
        "createdAt": "2025-05-25T02:18:51",
        "updatedAt": "2025-05-25T02:18:51"
      },
      {
        "id": 10,
        "name": "Feedback",
        "createdAt": "2025-05-25T02:18:51",
        "updatedAt": "2025-05-25T02:18:51"
      },
      {
        "id": 11,
        "name": "Troubleshooting",
        "createdAt": "2025-05-25T02:18:51",
        "updatedAt": "2025-05-25T02:18:51"
      },
      {
        "id": 12,
        "name": "Promotions",
        "createdAt": "2025-05-25T02:18:51",
        "updatedAt": "2025-05-25T02:18:51"
      },
      {
        "id": 13,
        "name": "FAQs",
        "createdAt": "2025-05-25T02:18:51",
        "updatedAt": "2025-05-25T02:18:51"
      },
      {
        "id": 14,
        "name": "Discounts",
        "createdAt": "2025-05-25T02:18:51",
        "updatedAt": "2025-05-25T02:18:51"
      },
      {
        "id": 15,
        "name": "New Arrivals",
        "createdAt": "2025-05-25T02:18:51",
        "updatedAt": "2025-05-25T02:18:51"
      },
      {
        "id": 16,
        "name": "Customer Service Policies",
        "createdAt": "2025-05-25T02:20:57",
        "updatedAt": "2025-05-25T02:20:57"
      },
      {
        "id": 17,
        "name": "Comparisons",
        "createdAt": "2025-05-25T02:20:57",
        "updatedAt": "2025-05-25T02:20:57"
      },
      {
        "id": 18,
        "name": "User Manuals",
        "createdAt": "2025-05-25T02:20:57",
        "updatedAt": "2025-05-25T02:20:57"
      },
      {
        "id": 19,
        "name": "Announcements",
        "createdAt": "2025-05-25T02:20:57",
        "updatedAt": "2025-05-25T02:20:57"
      }
    ],
    "pageNum": 1,
    "pageSize": 20,
    "size": 19,
    "startRow": 1,
    "endRow": 19,
    "pages": 1,
    "prePage": 0,
    "nextPage": 0,
    "isFirstPage": true,
    "isLastPage": true,
    "hasPreviousPage": false,
    "hasNextPage": false,
    "navigatePages": 8,
    "navigatepageNums": [1],
    "navigateFirstPage": 1,
    "navigateLastPage": 1
  }
}
```

### Get Tag

**URL**: <http://localhost:8080/api/tags/%7Bid%7D>  
**Method**: GET  
**Request Sample**: <http://localhost:8080/api/tags/1>  
**Return Sample**:

``` json
{
  "code": "200",
  "msg": "操作成功",
  "data": {
    "id": 1,
    "name": "Order Issues",
    "createdAt": "2025-05-25T02:15:43",
    "updatedAt": "2025-05-25T02:15:43"
  }
}
```

### Post Tag

**URL**: <http://localhost:8080/api/tags>  
**Method**: POST  
**Request Sample**:

``` json
{

    "code": "200",

    "msg": "操作成功",

    "data": {

        "id": 36,

        "name": "new tag",

        "createdAt": null,

        "updatedAt": null

    }

}
```

**Return Sample**:

``` json
{
  "code": "200",
  "msg": "操作成功",
  "data": {
    "id": 10,
    "name": "新标签"
  }
}
```
