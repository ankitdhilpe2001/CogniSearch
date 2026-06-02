import { tavily } from "@tavily/core"

const Tavily = tavily({
    apiKey: process.env.TAVILY_API_KEY
})

//function which search internet
export const searchInternet = async({query})=>{
    const results = await Tavily.search(query,{
        maxResults: 5,
        searchDepth:"advanced",
    })

    return JSON.stringify(results);
} 
