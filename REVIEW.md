# ADAM's REVIEW

My overall thoughts, opinions and considerations of my work throughout this assessment. Please note I used this project as a test case for my first use of Claude Code, very interesting experience. Much of the scaffolding/boilerplate was generated because I don't think I was really going to be assessed on this, I focused on design, architectural decisions and generally asked myself, how would someone use and extend this system in the future. 

## Project Timeline

The following is how I split up and managed my time to complete the assessment, upon reflection I think I spent a lot more than the 2-3 hours suggested but was still quite strict on my time so one particular task or feature didn't get the better of me and eat up my time.

- **Day (evening) 1:** Didn't even try to write code, just took the evening to read the brief, fully understand the problem, draw up a rough plan in my notebook, made a Postman collection so I could experiment with the open-meteo API. I was primarily concerned with the data I needed to handle, the data was very raw so I had to think how to make it useful, and manageable. Also, while on https://open-meteo.com/ I noticed there was a marine API which I suspected was likely geared towards the surfing use case so I played about with that as well.
- **Day 2:** Allocated to API work, the whole system is hinged on the API and if we're not handling the data correctly the app is useless. I used AI to scaffold the project, I used TypeScript and Nest.js as it's what I'm familiar with, and opinionated (in a good way) to ensure best structure and coding practices. Handling each activity started out in a big switch statement but quickly I realised one of the major gotchas of this project is to see how we extend the system with more activities and where the logic lived. More on that later.
- **Day 3:** Allocated (mostly) to frontend work, I'm very comfortable with React so this was straightward, applying all the best in class React patterns with small, composable components with hooks abstracted for logic. However, it's when got my frontend pulling data I noticed that the logic applied to the data was all wrong - and realised that working out "skiing" and "surfing" conditions where going to be more difficult, and likely could have taken up way more time to get "right". Did what I could and moved on, made some small UI quality of life improvements for demo purposes. 
- **Day (evening) 4:** Final evening was to review everything I had, but also dockerise the app so it was easy to review and write up this document, reflecting on my experiences and considerations I wanted to share, this is what you're reading...

## Architecture Decisions

Highlighting some of the most important considerations in terms of separation of concerns, extensibility and scaling.

### Activity Plugins

I feel this was probably the crux of the whole assignment so particular thought was given to how we handle activities and encapsulate their messy logic into one manageable place. If one wants to add another activity (brief example of hiking in project) then simply implement `IActivityPlugin` when creating a new plugin and it'll behave like the rest. In short:

- Adding new plugin by implementing contract, enable/disable and set priority scoring with no core changes to system.
- Plugin registry discovers activities at run time via config (emulated via a JSON object for demo purposes).
- Individual scoring/ranking logic wrapped up in each activity's plugin/module (ideally would also be config driven in real system) had to just guess weighting for values for demo purposes.
- Architecture designs, primarily my activity register, weather vs ranking modules, abstraction of logic and handlers.

### Clean Architecture and Design

- Separation of data fetching (weather module) via the open-meteo provider service, business logic which is abstracted into their own activity modules and handled in the ranking module. 
- API layer with GraphQL and resolvers, not actually my decision project requirement but GraphQL allows for flexible queries and adding more data in the future.
- Frontend-wise it follows are similar pattern, UI components are display components only, hooked used for fetching and handling data and API layer impl with apollo client and preset queries for data fetching.
- Debouncing added to service calls to stop users spamming the API -  trying to do it myself.

### Business/Domain Logic

- This was actually the hardest part to implement because who says what is considered hot, or cold, or too windy for outdoors etc so just had to assume everything.
- Each activity module implements its own logic in one file but brought another by a unified scoring system (0-100) and adjustments made accordingly.

### Omissions & Trade-offs

- Trade-offs made for handling data for surfing and skiing which were tricky because they relied on more data points than just indoor/outdoor activities.
- **Surfing** required extra data from the `/marine` API to be compared and weighted again the regular data points, plugin handles this optional extra data set if needed and present. Tried my best to implement but likely needs proximity to the coast and there wasn't enough time to implement this.
- **Skiing** similar in the sense it requirements the factor of altitude to be considered, again complexity grew as I tried to factor in more variables but lef it as-is. Cape Town is apparently a skiing destination if you're in the mountains (joke).
- As stated before, weighting and values needs to be config driven, I would leave to be a business person to tell me what exactly would be considered for each and how the weighting should be applied in a real application, regardless it's easy to make these changes as all this business logic only lives in each activity plugin implementation.

## Summary

Overall, this was a fun assignment, obviously another 100 things could have been done but I think this is decent attempt, while sticking to the timeline given and not going overboard, hopefully it's easy for you to parse, if you got this far thank you for reading my analysis!