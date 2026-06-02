import {tavily as Tavily} from "@tavily/core"

const Tavily = tavily({
    apiKey: process.env.TAVILY_API_KEY
})


export const searchInternet = async({query})=>{
    return await Tavily.search(query,{
        maxResults: 5,
        searchDepth:"advance",

    })
} 