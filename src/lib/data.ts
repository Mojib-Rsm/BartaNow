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
    imageUrl: 'https://picsum.photos/seed/1/600/400',
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
    imageUrl: 'https://picsum.photos/seed/2/600/400',
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
    imageUrl: 'https://picsum.photos/seed/3/600/400',
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
    imageUrl: 'https://picsum.photos/seed/4/600/400',
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
    imageUrl: 'https://picsum.photos/seed/5/600/400',
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
    imageUrl: 'https://picsum.photos/seed/6/600/400',
    imageHint: 'galaxy nebula',
    authorId: 'author-2',
    authorName: 'John Smith',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-17T18:00:00Z',
    aiSummary: 'New space telescopes are revolutionizing astronomy, providing unprecedented views of the early universe and exoplanets, heralding a new era of cosmic discovery.',
  },
  {
    id: '7',
    title: 'Quantum Computing: The Next Technological Leap',
    content: [
        "Quantum computing promises to revolutionize industries from medicine to finance by solving problems currently intractable for even the most powerful supercomputers. Unlike classical computers that use bits, quantum computers use qubits, which can exist in multiple states at once.",
        "This property, known as superposition, along with entanglement, allows quantum machines to perform complex calculations at incredible speeds. Researchers are racing to build stable, large-scale quantum computers, though significant engineering challenges remain.",
        "The potential applications are vast, including designing new materials, discovering novel drugs, and breaking current encryption standards. The quantum era is approaching, and it will redefine our technological landscape."
    ],
    imageUrl: 'https://picsum.photos/seed/7/600/400',
    imageHint: 'quantum computer',
    authorId: 'author-1',
    authorName: 'Jane Doe',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-16T11:00:00Z',
    aiSummary: 'Quantum computing, with its use of qubits and superposition, is set to solve complex problems beyond classical computers, promising major breakthroughs in various fields.'
  },
  {
    id: '8',
    title: 'Sustainable Architecture: Building for a Better Future',
    content: [
        "Sustainable architecture, or 'green building,' is a design philosophy that seeks to minimize the negative environmental impact of buildings. This is achieved through efficiency and moderation in the use of materials, energy, and development space.",
        "Key principles include using renewable materials, designing for energy efficiency with passive solar and natural ventilation, and integrating buildings with the natural landscape. Green roofs, rainwater harvesting systems, and living walls are becoming common features.",
        "These buildings are not only better for the planet but also healthier for their occupants, offering improved air quality and a greater connection to nature. As climate change accelerates, sustainable design is no longer a niche, but a necessity."
    ],
    imageUrl: 'https://picsum.photos/seed/8/600/400',
    imageHint: 'green building',
    authorId: 'author-2',
    authorName: 'John Smith',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-15T16:20:00Z',
    aiSummary: 'Sustainable architecture minimizes environmental impact through renewable materials and energy-efficient design, creating healthier buildings for people and the planet.'
  },
  {
    id: '9',
    title: 'The History and Future of the Internet',
    content: [
      "From its origins as a military project called ARPANET to the global network of today, the internet has transformed society in just a few decades. It has democratized information, connected billions of people, and created entirely new economies.",
      "The early web was a decentralized, text-based world. The dot-com boom of the late 90s brought commercialization and the graphical web, followed by the rise of social media and the mobile internet.",
      "Looking ahead, the internet's future may involve even greater decentralization with technologies like blockchain, more immersive experiences through the metaverse, and a stronger emphasis on privacy and digital rights. Its evolution is far from over."
    ],
    imageUrl: 'https://picsum.photos/seed/9/600/400',
    imageHint: 'network cables',
    authorId: 'author-1',
    authorName: 'Jane Doe',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-14T09:00:00Z',
    aiSummary: 'From its ARPANET origins to a global phenomenon, the internet has reshaped society. Its future points towards decentralization, the metaverse, and a focus on digital privacy.'
  },
  {
    id: '10',
    title: 'The Global Supply Chain: Strengths and Vulnerabilities',
    content: [
      "The modern global supply chain is a marvel of logistics, enabling products to be sourced, manufactured, and distributed across the world with incredible efficiency. This complex network has lowered consumer prices and fueled global economic growth.",
      "However, recent events have exposed its vulnerabilities. The COVID-19 pandemic, geopolitical tensions, and natural disasters have caused significant disruptions, leading to shortages and delays.",
      "Companies are now rethinking their supply chain strategies, moving towards greater resilience through diversification, regionalization, and increased investment in technology for better visibility and risk management. The era of pure cost optimization may be giving way to one of strategic resilience."
    ],
    imageUrl: 'https://picsum.photos/seed/10/600/400',
    imageHint: 'cargo ship',
    authorId: 'author-2',
    authorName: 'John Smith',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-13T12:00:00Z',
    aiSummary: 'While the global supply chain is a model of efficiency, recent disruptions have revealed its weaknesses, pushing companies to prioritize resilience over pure cost savings.'
  },
  {
    id: '11',
    title: 'Mindfulness and Meditation: A Path to Mental Clarity',
    content: [
      "In an age of constant distraction, the practices of mindfulness and meditation are gaining mainstream acceptance as powerful tools for improving mental well-being. Mindfulness is the practice of being present and fully aware of the current moment.",
      "Meditation, often a formal practice of mindfulness, involves setting aside time to train the mind, often by focusing on the breath or bodily sensations. Studies have shown it can reduce stress, improve focus, and even lead to structural changes in the brain associated with self-awareness and compassion.",
      "You don't need to be a monk to reap the benefits. Even a few minutes of daily practice can help calm the nervous system and provide a sense of inner peace and clarity."
    ],
    imageUrl: 'https://picsum.photos/seed/11/600/400',
    imageHint: 'person meditating',
    authorId: 'author-1',
    authorName: 'Jane Doe',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-12T08:30:00Z',
    aiSummary: 'Mindfulness and meditation are gaining recognition as effective methods for reducing stress and enhancing mental clarity, with even brief daily practice offering significant benefits.'
  },
  {
    id: '12',
    title: 'The Comeback of Vinyl: A Return to Analog Sound',
    content: [
      "In a digital world dominated by streaming, an old format is making a surprising comeback: the vinyl record. Music lovers are drawn to its warm, rich sound and the tangible experience of owning and playing a physical album.",
      "Album art, liner notes, and the ritual of placing a needle on a record offer a deeper connection to the music and the artist, something often lost in the convenience of digital playlists.",
      "This resurgence is not just about nostalgia; a new generation is discovering the unique audio fidelity and a more intentional way of listening. Record stores are thriving, and artists are increasingly releasing their music on vinyl, signaling that analog has a firm place in the digital age."
    ],
    imageUrl: 'https://picsum.photos/seed/12/600/400',
    imageHint: 'vinyl record',
    authorId: 'author-2',
    authorName: 'John Smith',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-11T17:00:00Z',
    aiSummary: 'Vinyl records are experiencing a major resurgence, attracting listeners with their warm analog sound and the tangible experience of physical media in a digital-first world.'
  },
  {
    id: '13',
    title: 'The Intricate World of Honey Bees',
    content: [
      "Honey bees are vital pollinators, crucial for the reproduction of many plants, including a large portion of the food we eat. Their complex social structure and communication methods, like the famous 'waggle dance,' have fascinated scientists for centuries.",
      "Within a hive, each bee has a specific role, from the queen who lays eggs to the worker bees who forage for nectar and pollen. Their collective efforts ensure the survival and prosperity of the colony.",
      "Unfortunately, bee populations are facing threats from habitat loss, pesticides, and climate change. Conservation efforts are essential to protect these indispensable insects and the ecosystems that depend on them."
    ],
    imageUrl: 'https://picsum.photos/seed/13/600/400',
    imageHint: 'honey bee',
    authorId: 'author-1',
    authorName: 'Jane Doe',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-10T10:45:00Z',
    aiSummary: 'Honey bees are essential pollinators with a complex social system. Facing threats from environmental changes, their protection is crucial for our ecosystems and food supply.'
  },
  {
    id: '14',
    title: 'The Art of Artisan Bread Making',
    content: [
      "Baking artisan bread at home has become a popular hobby, connecting people to a centuries-old tradition. The process is a blend of science and art, requiring patience, precision, and an understanding of fermentation.",
      "A simple mixture of flour, water, salt, and yeast can be transformed into a crusty, flavorful loaf with a tender crumb. The magic lies in the slow fermentation process, which develops complex flavors and a beautiful open texture.",
      "Beyond the delicious results, many find the process of kneading, shaping, and baking to be a meditative and rewarding experience. It's a tangible way to create something wonderful from the most basic ingredients."
    ],
    imageUrl: 'https://picsum.photos/seed/14/600/400',
    imageHint: 'artisan bread',
    authorId: 'author-2',
    authorName: 'John Smith',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-09T13:00:00Z',
    aiSummary: 'Artisan bread making, a blend of science and patience, turns simple ingredients into delicious loaves, offering a meditative and rewarding experience for home bakers.'
  },
  {
    id: '15',
    title: 'Navigating the World of Craft Coffee',
    content: [
      "The world of coffee has expanded far beyond the standard morning brew. 'Third wave' coffee culture emphasizes high-quality, single-origin beans and artisanal brewing methods that highlight unique flavor profiles.",
      "From pour-over and AeroPress to cold brew, each method extracts different characteristics from the beans, allowing coffee lovers to explore a spectrum of tastes, from fruity and acidic to nutty and chocolaty.",
      "Understanding the origin, roast level, and grind size are key to unlocking the perfect cup. It's a journey of discovery that transforms a daily ritual into a delightful sensory experience."
    ],
    imageUrl: 'https://picsum.photos/seed/15/600/400',
    imageHint: 'coffee cup',
    authorId: 'author-1',
    authorName: 'Jane Doe',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-08T09:15:00Z',
    aiSummary: 'Third wave coffee focuses on single-origin beans and artisanal brewing, turning coffee into a sensory journey of diverse flavors and methods.'
  }
];

export const mockDb = {
  authors,
  articles,
};
