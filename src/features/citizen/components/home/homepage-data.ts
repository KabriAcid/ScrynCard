import { formatNaira } from "@/lib/formatters";
import { mockPoliticians } from "@/lib/mock/politicians";
import { mockRedemptions } from "@/lib/mock/redemptions";

export const frontSamples = __SAMPLE_IMAGES__.filter(
	(sample) => !sample.isBack,
);
export const featuredSample =
	frontSamples.find((sample) =>
		sample.name.toLowerCase().includes("wedding"),
	) ?? frontSamples[0];
export const supportingSamples = frontSamples
	.filter((sample) => sample.src !== featuredSample?.src)
	.slice(0, 2);

const completedRedemptions = mockRedemptions.filter(
	(redemption) => redemption.status === "completed",
);

export const homeStats = [
	{
		label: "Partner organizations",
		value: new Set(
			mockPoliticians.map((politician) => politician.organization),
		).size.toString(),
	},
	{
		label: "Cards redeemed",
		value: completedRedemptions.length.toString(),
	},
	{
		label: "Value redeemed",
		value: formatNaira(
			completedRedemptions.reduce(
				(total, redemption) => total + redemption.amount,
				0,
			),
		),
		compact: true,
	},
];

export const mobileNavigationItems = [
	{ label: "Card gallery", href: "/samples" },
	{ label: "Sign in", href: "/login" },
	{ label: "Order cards", href: "/order" },
	{ label: "How it works", href: "/how-it-works" },
];

export const moments = [
	{
		number: "01",
		title: "For your customers",
		description:
			"Thank loyal customers, welcome new ones, and give every visit a little more meaning.",
	},
	{
		number: "02",
		title: "For your celebrations",
		description:
			"Give guests a keepsake with a useful reward inside, made for weddings and special days.",
	},
	{
		number: "03",
		title: "For your people",
		description:
			"Recognize a team, mark a milestone, or bring a community together with a thoughtful gift.",
	},
];

export const howItWorksSteps = [
	{
		title: "Choose",
		description: "Pick the airtime or data reward that fits your moment.",
	},
	{
		title: "Personalize",
		description: "Put your business, event, or message on the card.",
	},
	{
		title: "Share",
		description: "Hand it over. They redeem it online in a few simple steps.",
	},
];

export const frequentlyAskedQuestions = [
	{
		id: "what-is-scryncard",
		question: "What is Scryncard?",
		answer:
			"Scryncard turns a branded physical card into a useful gift, with an airtime or data reward recipients can redeem on their mobile phone.",
	},
	{
		id: "how-to-redeem",
		question: "How do I redeem a card?",
		answer:
			"Open the redemption page, enter the serial number and code from your card, provide the requested details, then choose the recipient's phone number and network before confirming.",
	},
	{
		id: "supported-networks",
		question: "Which mobile networks are supported?",
		answer:
			"The current experience lists MTN, Airtel, Glo, and 9Mobile. Available rewards can depend on the network and card you received.",
	},
	{
		id: "custom-cards",
		question: "Can I order cards for my business or event?",
		answer:
			"Yes. Scryncard cards are designed for businesses, celebrations, and organizations. Explore the gallery for design inspiration, then use the order flow to get started.",
	},
	{
		id: "reward-arrival",
		question: "When will the reward arrive?",
		answer:
			"Delivery time can vary by mobile network. After you confirm, the redemption screen will show whether the request was submitted successfully.",
	},
];
