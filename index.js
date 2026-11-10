
        // JavaScript - All in one file
        document.addEventListener('DOMContentLoaded', function() {
            // DOM elements
            const chatMessages = document.getElementById('chat-messages');
            const userInput = document.getElementById('user-input');
            const sendBtn = document.getElementById('send-btn');
            const typingIndicator = document.getElementById('typing-indicator');
            const adviceItems = document.querySelectorAll('.advice-item[data-advice]');
            
            // Modal elements
            const bmiBtn = document.getElementById('bmi-btn');
            const bmrBtn = document.getElementById('bmr-btn');
            const bmiModal = document.getElementById('bmi-modal');
            const bmrModal = document.getElementById('bmr-modal');
            const closeBmi = document.getElementById('close-bmi');
            const closeBmr = document.getElementById('close-bmr');
            const calculateBmiBtn = document.getElementById('calculate-bmi');
            const calculateBmrBtn = document.getElementById('calculate-bmr');

            // Helper: current time string HH:MM
            function nowTime() {
                const d = new Date();
                return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            // Show/hide typing indicator
            function showTypingIndicator() {
                typingIndicator.style.display = 'flex';
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 10);
            }

            function hideTypingIndicator() {
                typingIndicator.style.display = 'none';
            }

            // Add a message to chat
            function addMessage(text, sender) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

                const avatar = document.createElement('div');
                avatar.className = 'avatar ' + (sender === 'user' ? 'user' : 'bot');
                avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                bubble.innerHTML = `
                    <p style="margin:0;">${text.replace(/\n/g, '<br>')}</p>
                    <div class="meta">
                        <span class="time">${nowTime()}</span>
                    </div>
                `;

                messageDiv.appendChild(avatar);
                messageDiv.appendChild(bubble);
                
                chatMessages.appendChild(messageDiv);
                
                // Remove typing indicator if present
                if (chatMessages.contains(typingIndicator)) {
                    chatMessages.removeChild(typingIndicator);
                }
                
                // Add typing indicator back at bottom
                chatMessages.appendChild(typingIndicator);
                hideTypingIndicator();
                
                // Scroll to bottom
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 10);
            }

            // Initial messages
            setTimeout(() => {
                addMessage("Hello! I'm Medi-Max, your AI health assistant. How can I help you today? You can ask about symptoms, general advice, or use quick tips on the right.", 'bot');
            }, 300);
            
            setTimeout(() => {
                addMessage("Please remember: I'm an AI assistant and not a substitute for a real doctor. Always consult a healthcare professional for serious concerns.", 'bot');
            }, 1200);

            // Send message function
            function sendMessage() {
                const message = userInput.value.trim();
                if (!message) return;
                
                addMessage(message, 'user');
                userInput.value = '';
                showTypingIndicator();

                setTimeout(() => {
                    hideTypingIndicator();
                    const response = getAIResponse(message);
                    addMessage(response, 'bot');
                }, 1200);
            }

            // Event Listeners
            sendBtn.addEventListener('click', sendMessage);
            userInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // Quick advice clicks
            adviceItems.forEach(item => {
                item.addEventListener('click', function () {
                    const adviceType = this.getAttribute('data-advice');
                    askAboutAdvice(adviceType);
                    
                    // Add visual feedback
                    this.style.background = 'linear-gradient(90deg, #fee2e2, #fecaca)';
                    setTimeout(() => {
                        this.style.background = '';
                    }, 300);
                });
            });

            // Modal functions
            bmiBtn.addEventListener('click', () => {
                bmiModal.style.display = 'flex';
                document.getElementById('weight').focus();
            });

            bmrBtn.addEventListener('click', () => {
                bmrModal.style.display = 'flex';
                document.getElementById('age').focus();
            });

            closeBmi.addEventListener('click', () => {
                bmiModal.style.display = 'none';
            });

            closeBmr.addEventListener('click', () => {
                bmrModal.style.display = 'none';
            });

            // Close modals when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === bmiModal) bmiModal.style.display = 'none';
                if (e.target === bmrModal) bmrModal.style.display = 'none';
            });

            // BMI Calculation
            calculateBmiBtn.addEventListener('click', () => {
                const weight = parseFloat(document.getElementById('weight').value);
                const height = parseFloat(document.getElementById('height').value) / 100; // Convert to meters
                
                if (!weight || !height || height <= 0 || weight <= 0) {
                    alert('Please enter valid weight and height values');
                    return;
                }
                
                const bmi = weight / (height * height);
                const resultDiv = document.getElementById('bmi-result');
                const bmiValue = document.getElementById('bmi-value');
                const bmiCategory = document.getElementById('bmi-category');
                const bmiAdvice = document.getElementById('bmi-advice');
                
                bmiValue.textContent = `Your BMI: ${bmi.toFixed(1)}`;
                
                let category = '';
                let advice = '';
                let color = '';
                
                if (bmi < 18.5) {
                    category = 'Underweight-অতিরিক্ত কম ওজন';
                    advice = 'You may need to gain weight. Consider consulting a nutritionist-(আপনার ওজন বাড়ানো প্রয়োজন হতে পারে। একজন পুষ্টিবিদের সঙ্গে পরামর্শ করার কথা বিবেচনা করুন)';
                    color = '#f80303ff';
                } else if (bmi < 25) {
                    category = 'Normal weight-স্বাভাবিক ওজন';
                    advice = 'Great! Maintain your healthy lifestyle-(দারুণ! আপনার স্বাস্থ্যকর জীবনধারা বজায় রাখুন)';
                    color = '#26e718ff';
                } else if (bmi < 30) {
                    category = 'Overweight-অতিরিক্ত ওজন';
                    advice = 'Consider light exercise and balanced diet-(হালকা ব্যায়াম এবং সুষম খাদ্য বিবেচনা করুন)';
                    color = '#f59e0b';
                } else {
                    category = 'Obesity-স্থূলতা';
                    advice = 'Consult a healthcare provider for weight management-(ওজন ব্যবস্থাপনার জন্য একজন স্বাস্থ্যসেবা প্রদানকারীর সঙ্গে পরামর্শ করুন)';
                    color = '#fe0404ff';
                }

                
                
                bmiCategory.textContent = `Category: ${category}`;
                bmiCategory.style.color = color;
                bmiAdvice.textContent = advice;
                resultDiv.style.display = 'block';
                
                // Auto-scroll to result
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });

            // BMR Calculation
            calculateBmrBtn.addEventListener('click', () => {
                const gender = document.getElementById('gender').value;
                const age = parseFloat(document.getElementById('age').value);
                const weight = parseFloat(document.getElementById('bmr-weight').value);
                const height = parseFloat(document.getElementById('bmr-height').value);
                
                if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) {
                    alert('Please enter valid values for all fields');
                    return;
                }
                
                let bmr;
                if (gender === 'male') {
                    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
                } else {
                    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
                }
                
                const resultDiv = document.getElementById('bmr-result');
                const bmrValue = document.getElementById('bmr-value');
                const bmrAdvice = document.getElementById('bmr-advice');
                
                bmrValue.textContent = `Your BMR: ${Math.round(bmr)} calories/day`;
                bmrAdvice.textContent = `This is the minimum calories your body needs at rest. For activity levels, multiply by 1.2-1.9.`;
                resultDiv.style.display = 'block';
                
                // Auto-scroll to result
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });

            // Ask about advice function
            function askAboutAdvice(adviceType) {
                const userMessage = getAdvicePrompt(adviceType);
                addMessage(userMessage, 'user');
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    const response = getAIResponse(userMessage);
                    addMessage(response, 'bot');
                }, 1200);
            }

            // AI response logic
            function getAIResponse(userMessage) {
                const message = userMessage.toLowerCase();

                if (message.includes('headache') || message.includes('মাথা ব্যাথা')) {
                    return `মাথাব্যথার জন্য করণীয়:\n1) পর্যাপ্ত পানি পান করুন।\n2) শান্ত এবং অন্ধকারে বিশ্রাম নিন।\n3) ঠান্ডা কম্প্রেস ব্যবহার করুন।\n4) প্রয়োজনে OTC (ওভার-দ্য-কাউন্টার) ব্যথানাশক ওষুধ বিবেচনা করুন।\n\n**যদি ব্যথা তীব্র বা দীর্ঘস্থায়ী হয়, তাহলে ডাক্তারের পরামর্শ নিন।**`;
                } else if (message.includes('cold') || message.includes('flu') || message.includes('cough') || message.includes('fever') || message.includes('সর্দি')) {
                    return `সর্দি/জ্বর/কাশির জন্য করণীয়:\n1) পর্যাপ্ত বিশ্রাম নিন।\n2) প্রচুর পানি পান করুন।\n3) হালকা খাবার খান।\n4) প্রয়োজনে প্যারাসিটামল নিন।\n\n**যদি জ্বর ৩ দিনের বেশি থাকে বা ৩৯°সেলসিয়াসের বেশি হয়, ডাক্তার দেখান।**`;
                } else if (message.includes('sleep') || message.includes('insomnia') || message.includes('ঘুম')) {
                    return `ভালো ঘুমের জন্য করণীয়:\n1) প্রতিদিন একই সময়ে ঘুমাতে যান।\n2) ঘুমের আগে ফোন, ল্যাপটপ থেকে বিরতি নিন।\n3) শান্ত পরিবেশ তৈরি করুন।\n4) বেশি কফি, চা এড়িয়ে চলুন।\n5) নিয়মিত ব্যায়াম করুন।`;
                } else if (message.includes('stress') || message.includes('anxiety') || message.includes('চাপ')) {
                    return `চাপ থেকে মুক্তি পাওয়ার জন্য করণীয়:\n1) গভীর শ্বাস-প্রশ্বাস এবং ধ্যান করুন।\n2) নিয়মিত ব্যায়াম করুন।\n3) পর্যাপ্ত ঘুম নিশ্চিত করুন।\n4) বন্ধু বা পরিবারের সঙ্গে কথা বলুন।\n5) প্রয়োজনে মানসিক স্বাস্থ্য বিশেষজ্ঞের পরামর্শ নিন।`;
                } else if (message.includes('diet') || message.includes('food') || message.includes('eat') || message.includes('nutrition') || message.includes('খাদ্য')) {
                    return `ডায়েট টিপস:\n1) বিভিন্ন ধরনের ফল এবং সবজি খান।\n2) সম্পূর্ণ শস্য নির্বাচন করুন।\n3) পুষ্টিকর প্রোটিন অন্তর্ভুক্ত করুন।\n4) প্রক্রিয়াজাত খাবার সীমিত করুন।\n5) পর্যাপ্ত পানি পান করুন।`;
                } else if (message.includes('exercise') || message.includes('workout') || message.includes('fitness') || message.includes('ব্যায়াম')) {
                    return `ব্যায়াম নির্দেশিকা:\n1) প্রতি সপ্তাহে ১৫০ মিনিট ব্যায়াম করুন।\n2) সপ্তাহে ২–৩ বার শক্তি বৃদ্ধির সেশন করুন।\n3) ধীরে শুরু করুন এবং ধাপে ধাপে বাড়ান।\n4) এমন ব্যায়াম নির্বাচন করুন যা আপনার পছন্দের।\n5) নিয়মিত স্ট্রেচিং করুন।`;
                } else if (message.includes('mubin') || message.includes("mubeen")) {
                    return "My creator is Kaif Al Mubin, a great person who is currently studying for a Diploma in Engineering.";
                } else if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('হ্যালো')) {
                    return "Hello! I'm Medi-Max, your AI health assistant. How can I help you today?";
                } else if (message.includes('thank') || message.includes('thanks') || message.includes('ধন্যবাদ')) {
                    return "You're welcome! I'm here to provide general information — consult a healthcare professional for personalized care.";
                } else if (message.includes('Reduce') || message.includes('উদ্বেগ কমাতে')) {
                    return "উদ্বেগ কমাতে:\n1) গভীর শ্বাস-প্রশ্বাস\n2) মাইন্ডফুলনেস\n3) রুটিন তৈরি করুন\n4) পেশাদার সহায়তা . " ;
                } else if (message.includes('help') || message.includes('support') || message.includes('সহায়তা')) {
                    return `আমি আপনার স্বাস্থ্য–সংক্রান্ত প্রশ্নগুলোর উত্তর দিতে পারি, সাধারণ উপসর্গ ব্যাখ্যা করতে পারি—আমি সাধারণ তথ্য দিই, চিকিৎসকের বিকল্প নই।`;
                } else {
                    return "I understand you're asking about '" + userMessage + "'. I can provide general info on common health topics. For specific medical advice, diagnosis, or treatment, please consult a qualified healthcare professional.";
                }
            }

            function getAdvicePrompt(adviceType) {
                const prompts = {
                    'headache': 'What should I do for a headache? মাথাব্যথার জন্য কী করব?',
                    'cold': 'How can I treat cold symptoms? সর্দিজ্বরের চিকিৎসা কী?',
                    'sleep': 'How can I improve my sleep? ঘুমের মান কিভাবে উন্নত করব?',
                    'stress': 'What are ways to reduce stress? চাপ কমানোর উপায় কী?',
                    'diet': 'What should I eat for a healthier diet? স্বাস্থ্যকর খাদ্য কী খাব?',
                    'exercise': 'What exercises should I do daily? দৈনিক কী ব্যায়াম করব?'
                };
                return prompts[adviceType] || 'Tell me about health tips. স্বাস্থ্য টিপস বলুন।';
            }

            // Auto-focus on input field
            userInput.focus();
            
            // Add click sound effect for buttons
            document.querySelectorAll('button, .advice-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    // Optional: Add sound effect here if desired
                    console.log('Button clicked');
                });
            });
            
            // Smooth scroll for chat messages
            chatMessages.addEventListener('wheel', (e) => {
                e.preventDefault();
                chatMessages.scrollTop += e.deltaY;
            });
        });
