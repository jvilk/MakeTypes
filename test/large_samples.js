"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./common/util");
var WorldBankProxy_1 = require("./generated/WorldBankProxy");
var GitHubProxy_1 = require("./generated/GitHubProxy");
var TwitterStreamProxy_1 = require("./generated/TwitterStreamProxy");
describe("Large Samples", function () {
    it("World Bank", function () {
        var wb = [
            {
                "page": 1,
                "pages": 1,
                "per_page": "1000",
                "total": 53
            }
        ];
        var wb2 = [
            {
                "page": 1,
                "pages": 1,
                "per_page": "1000",
                "total": 53
            },
            [
                {
                    "indicator": {
                        "id": "GC.DOD.TOTL.GD.ZS",
                        "value": "Central government debt, total (% of GDP)"
                    },
                    "country": {
                        "id": "CZ",
                        "value": "Czech Republic"
                    },
                    "value": null,
                    "decimal": "1",
                    "date": "2012"
                }
            ]
        ];
        util_1.parseEquals(WorldBankProxy_1.WorldBankProxy, JSON.stringify(wb), wb);
        util_1.parseEquals(WorldBankProxy_1.WorldBankProxy, JSON.stringify(wb2), wb2);
        util_1.parseThrows(WorldBankProxy_1.WorldBankProxy, JSON.stringify({
            "page": 1, "per_page": 1000
        }));
        // Type checking: Figure out what is a page / what isn't.
        var wbParsed = WorldBankProxy_1.WorldBankProxy.Parse(JSON.stringify(wb2));
        if (Array.isArray(wbParsed)) {
            wbParsed.forEach(function (wbEntry) {
                if (Array.isArray(wbEntry)) {
                    // TS knows this is the actual data.
                    wbEntry[0].indicator;
                }
                else if (wbEntry !== null) {
                    // TS knows this is not an array, so it must be the page data.
                    wbEntry.page;
                }
            });
        }
    });
    it("GitHub", function () {
        var GH = {
            "url": "https://api.github.com/repos/fsharp/FSharp.Data/issues/879",
            "labels_url": "https://api.github.com/repos/fsharp/FSharp.Data/issues/879/labels{/name}",
            "comments_url": "https://api.github.com/repos/fsharp/FSharp.Data/issues/879/comments",
            "events_url": "https://api.github.com/repos/fsharp/FSharp.Data/issues/879/events",
            "html_url": "https://github.com/fsharp/FSharp.Data/issues/879",
            "id": 109254988,
            "number": 879,
            "title": "Bug when call request from Http module",
            "user": {
                "login": "flypixel",
                "id": 14139485,
                "avatar_url": "https://avatars.githubusercontent.com/u/14139485?v=3",
                "gravatar_id": "",
                "url": "https://api.github.com/users/flypixel",
                "html_url": "https://github.com/flypixel",
                "followers_url": "https://api.github.com/users/flypixel/followers",
                "following_url": "https://api.github.com/users/flypixel/following{/other_user}",
                "gists_url": "https://api.github.com/users/flypixel/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/flypixel/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/flypixel/subscriptions",
                "organizations_url": "https://api.github.com/users/flypixel/orgs",
                "repos_url": "https://api.github.com/users/flypixel/repos",
                "events_url": "https://api.github.com/users/flypixel/events{/privacy}",
                "received_events_url": "https://api.github.com/users/flypixel/received_events",
                "type": "User",
                "site_admin": false
            },
            "labels": [
                {
                    "url": "https://api.github.com/repos/fsharp/FSharp.Data/labels/type-bug",
                    "name": "type-bug",
                    "color": "6E0069"
                },
                {
                    "url": "https://api.github.com/repos/fsharp/FSharp.Data/labels/up-for-grabs",
                    "name": "up-for-grabs",
                    "color": "207de5"
                }
            ],
            "state": "open",
            "locked": false,
            "assignee": null,
            "milestone": null,
            "comments": 2,
            "created_at": "2015-10-01T08:47:05Z",
            "updated_at": "2015-10-11T11:18:02Z",
            "closed_at": null,
            "body": "```fsharp\r\n[<LiteralAttribute>]\r\nlet url = \"http://www.staples.com/\"\r\nlet custom (req: System.Net.HttpWebRequest) = \r\n    req.Proxy <- new System.Net.WebProxy(\"http://XXX.XXX.XXX.XXX:8889\")\r\n    req\r\nlet page = Http.RequestString(url=url, customizeHttpRequest=custom)\r\n```\r\nand I get this exception in fsi:\r\n*System.ArgumentOutOfRangeException: Length cannot be less than zero.\r\nParameter name: length\r\n   at Microsoft.FSharp.Control.AsyncBuilderImpl.commit[a](Result`1 res)\r\n   at Microsoft.FSharp.Control.CancellationTokenOps.RunSynchronously[a](CancellationToken token, FSharpAsync`1 computation, FSharpOption`1 timeout)\r\n   at Microsoft.FSharp.Control.FSharpAsync.RunSynchronously[T](FSharpAsync`1 computation, FSharpOption`1 timeout, FSharpOption`1 cancellationToken)\r\n   at <StartupCode$FSI_0004>.$FSI_0004.main@() in ...\\HttpExperiment.fsx:line 42\r\nStopped due to error.*\r\nWhen I use standard *HttpWebRequest* for the same purposes, no exceptions were raised.\r\nP.S. There are sites where this exception wasn't raised in the same situation."
        };
        util_1.parseEquals(GitHubProxy_1.GitHubProxy, JSON.stringify(GH), GH);
        util_1.parseThrows(GitHubProxy_1.GitHubProxy, "[]");
    });
    it("Twitter", function () {
        var tw = { "in_reply_to_status_id_str": null, "text": "I hate this stupid bumper on my iPhone. I want a new case  waahhhhh", "in_reply_to_user_id_str": null, "retweet_count": 0, "geo": null, "source": "\u003Ca href=\"http:\/\/twitter.com\/devices\" rel=\"nofollow\"\u003Etxt\u003C\/a\u003E", "retweeted": false, "truncated": false, "id_str": "263290764656791552", "entities": { "user_mentions": [], "hashtags": [], "urls": [] }, "in_reply_to_user_id": null, "in_reply_to_status_id": null, "place": null, "coordinates": null, "in_reply_to_screen_name": null, "created_at": "Tue Oct 30 14:46:24 +0000 2012", "user": { "notifications": null, "contributors_enabled": false, "time_zone": "Alaska", "profile_background_color": "C0DEED", "location": "Portland, Oregon.", "profile_background_tile": false, "profile_image_url_https": "https:\/\/si0.twimg.com\/profile_images\/2782994666\/db3c2083f2a8840f6e76e9069bfaea61_normal.jpeg", "default_profile_image": false, "follow_request_sent": null, "profile_sidebar_fill_color": "DDEEF6", "description": "16 & I talk to myself.", "profile_banner_url": "https:\/\/si0.twimg.com\/profile_banners\/446688343\/1351200744", "favourites_count": 444, "screen_name": "MsHaileyMary", "profile_sidebar_border_color": "C0DEED", "id_str": "446688343", "verified": false, "lang": "en", "statuses_count": 2774, "profile_use_background_image": true, "protected": false, "profile_image_url": "http:\/\/a0.twimg.com\/profile_images\/2782994666\/db3c2083f2a8840f6e76e9069bfaea61_normal.jpeg", "listed_count": 2, "geo_enabled": false, "created_at": "Mon Dec 26 01:51:32 +0000 2011", "profile_text_color": "333333", "name": "Hailey", "profile_background_image_url": "http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png", "friends_count": 199, "url": null, "id": 446688343, "is_translator": false, "default_profile": true, "following": null, "profile_background_image_url_https": "https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png", "utc_offset": -32400, "profile_link_color": "0084B4", "followers_count": 221 }, "id": 263290764656791552, "contributors": null, "favorited": false };
        util_1.parseEquals(TwitterStreamProxy_1.TwitterStreamProxy, JSON.stringify(tw), tw);
        util_1.parseThrows(TwitterStreamProxy_1.TwitterStreamProxy, JSON.stringify({ 'delete': {} }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFyZ2Vfc2FtcGxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxhcmdlX3NhbXBsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBdUQ7QUFFdkQsNkRBQTBEO0FBRTFELHVEQUFvRDtBQUVwRCxxRUFBa0U7QUFFbEUsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUN4QixFQUFFLENBQUMsWUFBWSxFQUFFO1FBQ2YsSUFBTSxFQUFFLEdBQWM7WUFDcEI7Z0JBQ0UsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07Z0JBQ2xCLE9BQU8sRUFBRSxFQUFFO2FBQ1o7U0FDRixDQUFDO1FBRUYsSUFBTSxHQUFHLEdBQWM7WUFDckI7Z0JBQ0UsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07Z0JBQ2xCLE9BQU8sRUFBRSxFQUFFO2FBQ1o7WUFDRDtnQkFDRTtvQkFDRSxXQUFXLEVBQUU7d0JBQ1gsSUFBSSxFQUFFLG1CQUFtQjt3QkFDekIsT0FBTyxFQUFFLDJDQUEyQztxQkFDckQ7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULElBQUksRUFBRSxJQUFJO3dCQUNWLE9BQU8sRUFBRSxnQkFBZ0I7cUJBQzFCO29CQUNELE9BQU8sRUFBRSxJQUFJO29CQUNiLFNBQVMsRUFBRSxHQUFHO29CQUNkLE1BQU0sRUFBRSxNQUFNO2lCQUNmO2FBQ0Y7U0FDRixDQUFDO1FBRUYsa0JBQVcsQ0FBWSwrQkFBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0Qsa0JBQVcsQ0FBWSwrQkFBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakUsa0JBQVcsQ0FBQywrQkFBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDekMsTUFB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