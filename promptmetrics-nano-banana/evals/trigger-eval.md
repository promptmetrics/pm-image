# Trigger Evaluation — promptmetrics-nano-banana

## Queries that SHOULD trigger the skill

1. **"I need a hero image for a PromptMetrics blog post about approval gates in Claude agents."**
   - Explicitly names PromptMetrics and an image need (hero image).

2. **"Create a warm-cream Paper-brand editorial illustration for our PromptMetrics landing page that shows a human-in-the-loop review."**
   - Matches the Paper brand visual language and an image-generation intent, tied to PromptMetrics.

3. **"Can you recommend a Nano Banana prompt for a PromptMetrics social card about AI observability?"**
   - Directly asks for Nano Banana prompt recommendations for a PromptMetrics topic.

4. **"I have this article draft about token cost spikes. Can you find an image prompt that fits the PromptMetrics blog?"**
   - Content-illustration mode signal: article + request for a PromptMetrics image.

5. **"Generate a PromptMetrics-branded diagram that shows the difference between read-only and approval-required agent modes."**
   - Image request tied to PromptMetrics brand and a concrete governance topic.

## Queries that SHOULD NOT trigger the skill

1. **"How do I configure read-only mode in my Claude agent?"**
   - No image request; this is a configuration question, not a visual task.

2. **"Summarize the PromptMetrics Paper brand guidelines for me."**
   - The user wants a text summary of the brand guide, not a prompt recommendation or image remix.

3. **"What is the price of Nano Banana Pro?"**
   - General pricing question with no PromptMetrics or image-generation context.

4. **"Make me a picture of a sunset for my personal Instagram."**
   - Generic image request with no PromptMetrics, Paper brand, or Nano Banana context.

5. **"Draw a cyberpunk cityscape for my game."**
   - Image request, but the style and topic have no PromptMetrics connection.

6. **"I want an anti-hype editorial illustration with warm cream colors."**
   - Style-only request with no PromptMetrics or Nano Banana tie; too broad to trigger.
