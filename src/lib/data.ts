import type { Article, Author } from './types';

const authors: Author[] = [
  { id: 'author-1', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=author-1' },
  { id: 'author-2', name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=author-2' },
];

const articles: Article[] = [
  {
    id: '1',
    title: 'The Future of Renewable Energy',
    content: [
      "Renewable energy is at the forefront of the global conversation on sustainability and climate change. As technology advances, sources like solar, wind, and geothermal are becoming increasingly viable and cost-effective alternatives to fossil fuels.",
      "Governments and corporations worldwide are investing billions in renewable infrastructure, recognizing the long-term benefits of a cleaner planet and energy independence. The transition, however, is not without its challenges, including grid integration, energy storage, and the need for supportive policies.",
      "Innovations in battery technology are particularly crucial, as they address the intermittent nature of solar and wind power. By storing excess energy, we can ensure a consistent supply, even when the sun isn't shining or the wind isn't blowing. The next decade will be pivotal in shaping our energy future."
    ],
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'wind turbines',
    authorId: 'author-1',
    authorName: 'Jane Doe',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-22T10:00:00Z',
    aiSummary: 'A look into the advancements and challenges of renewable energy, highlighting the importance of new technologies and global investment for a sustainable future.',
  },
  {
    id: '2',
    title: 'Exploring the Deep Sea: New Discoveries',
    content: [
        "The deep sea remains one of the last truly unexplored frontiers on Earth. Recent expeditions using advanced submersibles have unveiled a stunning array of new species and geological formations, challenging our understanding of life's resilience.",
        "Bioluminescent creatures light up the abyssal plains, while hydrothermal vents support entire ecosystems thriving on chemical energy instead of sunlight. These discoveries have profound implications for astrobiology, suggesting that life could exist in similar extreme environments on other planets.",
        "Protecting these fragile ecosystems from human impact, such as deep-sea mining and pollution, is a growing concern for scientists and conservationists. The race is on to study and understand these environments before they are irrevocably altered."
    ],
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'deep sea',
    authorId: 'author-2',
    authorName: 'John Smith',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-21T14:30:00Z',
    aiSummary: 'Recent deep-sea explorations have uncovered new species and ecosystems, offering insights into life\'s adaptability and the potential for extraterrestrial life.',
  },
  {
    id: '3',
    title: 'The Rise of Artificial Intelligence in Art',
    content: [
        "Artificial intelligence is no longer just a tool for scientists and engineers; it's now a canvas for artists. AI-powered algorithms can generate breathtaking visuals, compose music, and even write poetry, blurring the lines between human and machine creativity.",
        "This new wave of 'generative art' raises fascinating questions about authorship, originality, and the nature of creativity itself. Is the artist the one who writes the code, or is the AI a creative partner in its own right? Museums and galleries are beginning to feature AI-generated works, sparking a lively debate in the art world.",
        "While some purists are skeptical, many artists are embracing AI as a powerful new medium that extends their creative possibilities. The collaboration between human intuition and machine learning is poised to unlock entirely new forms of artistic expression."
    ],
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'abstract art',
    authorId: 'author-1',
    authorName: 'Jane Doe',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-20T09:00:00Z',
    aiSummary: 'AI is transforming the art world by enabling new forms of generative creativity, sparking debates about authorship and pushing the boundaries of artistic expression.',
  },
  {
    id: '4',
    title: 'Urban Farming: A Green Revolution in Our Cities',
    content: [
      "As urban populations grow, so does the challenge of feeding them sustainably. Urban farming, from rooftop gardens to vertical farms in skyscrapers, is emerging as a powerful solution to bring fresh, local produce to city dwellers.",
      "These innovative farming methods reduce food miles, minimize water usage through hydroponics and aeroponics, and reconnect people with their food sources. They also contribute to greener cities, improve air quality, and create community hubs.",
      "While not a replacement for traditional agriculture, urban farming is a vital component of a more resilient and sustainable food system. It empowers communities, enhances food security, and transforms concrete jungles into vibrant, productive landscapes."
    ],
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'urban farm',
    authorId: 'author-2',
    authorName: 'John Smith',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-19T11:45:00Z',
    aiSummary: 'Urban farming is revolutionizing city food systems with sustainable methods like vertical farms, reducing food miles and enhancing local food security.',
  },
  {
    id: '5',
    title: 'The Science of Sleep: Why It Matters More Than You Think',
    content: [
      "In our fast-paced world, sleep is often the first thing we sacrifice. However, a growing body of research reveals that quality sleep is fundamental to our physical and mental health, affecting everything from memory consolidation to immune function.",
      "During sleep, the brain works to repair itself, process information, and clear out toxins. Chronic sleep deprivation is linked to a host of problems, including an increased risk of heart disease, diabetes, and depression.",
      "Experts recommend 7-9 hours of quality sleep per night for most adults. Simple habits like maintaining a regular sleep schedule, creating a restful environment, and avoiding screens before bed can significantly improve sleep quality and overall well-being."
    ],
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'peaceful bedroom',
    authorId: 'author-1',
    authorName: 'Jane Doe',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-18T22:00:00Z',
    aiSummary: 'Quality sleep is crucial for health, impacting memory and immunity. Chronic deprivation increases health risks; experts advise 7-9 hours nightly.',
  },
  {
    id: '6',
    title: 'A Journey Through the Stars: The Latest in Space Telescopes',
    content: [
      "With the launch of next-generation space telescopes, our view of the cosmos has never been clearer. These powerful observatories are peering back to the dawn of time, capturing images of the first galaxies and studying the atmospheres of distant exoplanets.",
      "The incredible data being collected is fueling a golden age of astronomy, leading to breakthroughs in our understanding of dark matter, black holes, and the origins of the universe.",
      "Each new image is a testament to human ingenuity and our insatiable curiosity to understand our place in the universe. The discoveries from these telescopes will continue to inspire and awe for generations to come."
    ],
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'galaxy nebula',
    authorId: 'author-2',
    authorName: 'John Smith',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-17T18:00:00Z',
    aiSummary: 'New space telescopes are revolutionizing astronomy, providing unprecedented views of the early universe and exoplanets, heralding a new era of cosmic discovery.',
  }
];

export const mockDb = {
  authors,
  articles,
};
