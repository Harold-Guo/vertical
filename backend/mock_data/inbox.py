INBOX_RECORDINGS = [
    {
        "id": "inbox-1",
        "title": "Initial Outreach — NovaStar Corp",
        "subtitle": "Feb 20, 2025 · 1:30 PM",
        "duration": "25 min",
        "assignedTo": "NovaStar Corp",
        "status": "assigned",
    },
    {
        "id": "inbox-2",
        "title": "Product Overview — Unknown",
        "subtitle": "Feb 18, 2025 10:30 AM",
        "duration": "30 min",
        "assignedTo": "To: Lisa...",
        "status": "processing",
    },
]

INBOX_METRICS = {
    "recordingsCount": 5,
    "thisWeek": 3,
    "avgDuration": "34 min",
    "processing": 1,
}

INBOX_RECORDING_DETAIL = {
    "id": "inbox-1",
    "title": "Pricing Review",
    "date": "Feb 3, 2026",
    "duration": "32 min",
    "participants": 3,
    "assignedProject": "Acme Corp Enterprise Deal",
    "summary": """The customer expressed strong interest in the enterprise pricing tier but raised concerns about the implementation timelines. Key decision maker (VP of Engineering) was present and asked detailed questions about API integration capabilities.

The pricing discussion revealed a budget range of $250,000 to $400,000, slightly below our initial quote of $350,000. However, the customer showed willingness to a phased implementation approach as a way to manage costs while maintaining the full project scope.

Security compliance emerged as a critical decision factor. The CTO specifically raised SOC 2 Type II certification requirements and asked about data encryption standards. We confirmed two current certifications and are offering to share the full compliance report.""",
    "keyPoints": [
        {"text": "Enterprise pricing structure best-fit options", "tag": "Pricing"},
        {"text": "API integration with Salesforce, HQ, and 20+ tools", "tag": "Technical"},
        {"text": "SOC 2 Type II compliance and data security standards", "tag": "Compliance"},
        {"text": "Implementation timeline and phased rollout approach", "tag": "Timeline"},
    ],
    "nextSteps": "Customer requested to revisit proposal incorporating phased pricing and addressing SOC 2 compliance requirements. A follow-up technical deep-dive with the engineering team is tentatively scheduled for the week of February 15. The revised proposal should include updated API documentation and a security compliance checklist.",
    "transcript": [
        {"speaker": "John Dialed", "time": "0:14", "text": "I'd like to walk through our enterprise pricing structure. Based on your team size of 200, you'd fall into our premium tier offering."},
        {"speaker": "Sarah (VP)", "time": "1:30", "text": "That's helpful. Our budget is between $250K and $350K. Can you tell me more about the 1:1 integration capabilities?"},
        {"speaker": "John Dialed", "time": "3:30", "text": "We offer native integrations with Salesforce, Jira, Writ 30+ tools. Let me share our API documentation."},
        {"speaker": "James Chen", "time": "5:10", "text": "disclosing: We also need multi-region support. For APAC, our requirements include data residency in Singapore and Japan. Pacific timezone."},
        {"speaker": "Mike (CTO)", "time": "8:30", "text": "What about security compliance? We need SOC 2 Type II certification. Have you established SOC 2 to date?"},
        {"speaker": "John Dialed", "time": "10:45", "text": "Great question. Yes, we are certified. SOC 2 Type II audit last quarter. I can share our full compliance report for your security team to review."},
    ],
}
