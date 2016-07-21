chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        
        return redirect(details);
    },
    {
        urls: [
            "https://api.asm.skype.com/*",
            "https://login.skype.com/*"
        ],
        types: [
            'main_frame'
        ]
    },
    [
        'blocking'
    ]
);

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        if (extractStatusCode(details.statusLine) == 401) {
            
            return {
                redirectUrl: "https://web.skype.com/"
            };
        }
    },
    {
        urls: [
            "https://api.asm.skype.com/*"
        ]
    },
    [
        "blocking"
    ]
);

function redirect(details) {
    var pattern, from, to, match;
    
    var regexList = [
        [
            'https://api.asm.skype.com/s/i\\?(.*)',
            'https://api.asm.skype.com/v1/objects/$1/views/imgpsh_fullsize'
        ],
        [
            'https://login.skype.com/login/sso\\?go=xmmfallback\\?pic=(.*)',
            'https://api.asm.skype.com/v1/objects/$1/views/imgpsh_fullsize'
        ],
        [
            'https://login.skype.com/login/sso\\?go=webclient\.xmm\\&pic=(.*)',
            'https://api.asm.skype.com/v1/objects/$1/views/imgpsh_fullsize'
        ]
    ];
    
    for (var i = 0; i < regexList.length; ++i) {
        
        from = regexList[i][0];
        to   = regexList[i][1];
        
        pattern = new RegExp(from, 'ig');
        match   = details.url.match(pattern);
        
        if (match) {
            var redirectUrl = details.url.replace(pattern, to);
            if (redirectUrl != details.url) {
                
                return {
                    redirectUrl: redirectUrl
                };
            }
        }
    }
    
    return {};
}

function extractStatusCode(line) {
    var match = line.match(/[^ ]* (\d{3}) (.*)/);
    if (match) {
        
        return match[1];
    } else {
        
        return undefined;
    }
}
