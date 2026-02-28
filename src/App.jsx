import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Building2,
    Briefcase,
    School,
    Users,
    Clock,
    Sunset,
    Utensils,
    CheckCircle2,
    Plus,
    Send,
    AlertTriangle
} from 'lucide-react'
import logo from './assets/logo.png'
import { EVENT_CONFIG, isRegistrationOpen } from './config'
import { FormField } from './components/FormField'
import './App.css'

const UNIVERSITIES = [
    "American University of Beirut (AUB)",
    "Lebanese American University (LAU)",
    "Saint Joseph University (USJ)",
    "Lebanese University (LU)",
    "Notre Dame University (NDU)",
    "Balamand University (UOB)",
    "Beirut Arab University (BAU)",
    "Holy Spirit University of Kaslik (USEK)",
    "Rafik Hariri University (RHU)",
    "American University of Science and Technology (AUST)",
    "Lebanese International University (LIU)",
    "Global University",
    "Arts, Sciences and Technology University in Lebanon (AUL)",
    "Islamic University of Lebanon (IUL)",
    "Antonine University (UA)",
    "Al-Maaref University",
    "Azm University",
    "Phoenicia University",
    "Manar University of Tripoli (MUT)"
]

const REGIONS = [
    "Beirut", "Metn/Baabda", "Jbeil/Keserwen", "Aley/Chouf",
    "North", "Akkar", "South/Nabatiyi", "Beqaa/Hermel", "Outside Lebanon"
]

const EXPERIENCE_CATEGORIES = {
    Student: [
        "1st - 2nd Year",
        "3rd Year",
        "Master Student",
        "PHD",
        "Fresh Graduate",
        "Bootcamp Attendee",
        "Bootcamp Graduate",
        "Looking for a job"
    ],
    Professional: [
        "Intern",
        "< 1 year",
        "1 - 3 years",
        "3 - 5 years",
        "5+ years",
    ],
    "Manager / Team Lead": [
        "CTO",
        "CEO",
        "Project Manager",
        "Manager / Director",
        "Executive Manager",
        "Executive / Founder"
    ]
}

const SPECIALIZATIONS = [
    "AI Engineer / Researcher", "Full Stack Developer", "Data Scientist / Engineer",
    "Cloud / DevOps Engineer", "Backend Developer", "Frontend Developer",
    "Mobile Developer", "Product / Project Manager", "UX/UI Designer", "QA Engineer",, "Other in tech", "Other non-tech"
]

const TECH_INTERESTS = [
    "Front End", "Cloud", "Kubernetes", "Microservices", "Databases",
    "Android", "Flutter", "Machine Learning", "Tensorflow / Keras",
    "Google Gemini / ChatGPT", "Cybersecurity", "Web3 / Blockchain", "Other"
]

const TAKEAWAYS = [
    "Learning about new technologies", "Networking with peers/experts",
    "Hands-on workshops", "Listening to inspiring speakers",
    "Engaging with the local tech community", "Career opportunities",
    "Participating in the Open Source challenge", "Other"
]

const App = () => {
    const [isOpen, setIsOpen] = useState(true)

    const [formData, setFormData] = useState({
        secretCode: '',
        email: '',
        firstName: '',
        lastName: '',
        specialization: '',
        activeExpCategories: [],
        expLevels: {
            Student: 0,
            Professional: 0,
            "Manager / Team Lead": 0
        },
        status: '', // Derived from experience (student/prof/fresh)
        company: '',
        university: '',
        region: '',
        ageRange: '',
        gender: '',
        linkedIn: '',
        phone: '',
        attendedBefore: '',
        takeaways: [],
        referral: '',
        techInterests: [],
        otherTechInterestInput: '',
        comments: '',
        attendanceType: ''
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Company Search State
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showAddCompany, setShowAddCompany] = useState(false)

    useEffect(() => {
        setIsOpen(isRegistrationOpen());
    }, [])

    useEffect(() => {
        if (searchTerm.length > 1) {
            const results = UNIVERSITIES.filter(u =>
                u.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setSearchResults(results)
            setShowAddCompany(results.length === 0 || !results.find(r => r === searchTerm))
        } else {
            setSearchResults([])
            setShowAddCompany(false)
        }
    }, [searchTerm])

    // Derive status simple category for the badge based on experience selection
    useEffect(() => {
        let newStatus = 'professional';
        if (formData.activeExpCategories.includes('Manager / Team Lead')) {
            newStatus = 'professional';
        } else if (formData.activeExpCategories.includes('Professional')) {
            newStatus = 'professional';
        } else if (formData.activeExpCategories.includes('Student')) {
            const studentLevel = EXPERIENCE_CATEGORIES.Student[formData.expLevels.Student];
            if (studentLevel === "Fresh Graduate" || studentLevel === "Bootcamp Graduate") {
                newStatus = 'fresh_graduate';
            } else {
                newStatus = 'student';
            }
        } else {
            newStatus = 'attendee';
        }

        setFormData(prev => ({ ...prev, status: newStatus }));
    }, [formData.activeExpCategories, formData.expLevels]);

    const validate = () => {
        const newErrors = {};
        if (!formData.secretCode) newErrors.secretCode = 'Secret code is required';
        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.specialization) newErrors.specialization = 'Please select a specialization';
        if (formData.activeExpCategories.length === 0) newErrors.experience = 'Please select at least one experience category';
        if (!formData.region) newErrors.region = 'Please select a region';
        if (!formData.attendedBefore) newErrors.attendedBefore = 'Please select an option';
        if (formData.takeaways.length === 0) newErrors.takeaways = 'Please select your main takeaways';
        if (!formData.referral) newErrors.referral = 'Please select how you heard about us';
        if (!formData.attendanceType) newErrors.attendanceType = 'Please select your expected attendance';
        if (!formData.company && !formData.university && !searchTerm) {
            newErrors.companySearch = 'Company or university is required. Search and select or add a new one.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Scroll to the first error smoothly
            const firstErrorField = document.querySelector('.has-error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }

    const handleMultiSelect = (name, value) => {
        setFormData(prev => {
            const currentList = prev[name];
            const newList = currentList.includes(value)
                ? currentList.filter(item => item !== value)
                : [...currentList, value];
            return { ...prev, [name]: newList };
        });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }

    const isProfessionalOrFreshGrad = formData.status === 'professional' || formData.status === 'fresh_graduate';

    if (!isOpen) {
        return (
            <div className="app-container closed-container">
                <div className="logo-container">
                    <img src={logo} alt="GDG Lebanon Logo" className="logo" />
                </div>
                <div className="closed-message">
                    <AlertTriangle size={48} className="warning-icon" />
                    <h1>Registration Closed</h1>
                    <p>Thank you for your interest! Registration for {EVENT_CONFIG.eventName} is now closed.</p>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="app-container success-container">
                <div className="logo-container">
                    <img src={logo} alt="GDG Lebanon Logo" className="logo" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="success-message"
                >
                    <CheckCircle2 size={64} className="success-icon" />
                    <h1>RSVP Submitted Successfully!</h1>
                    <p>Thank you, {formData.firstName}. We have received your registration and will contact you soon.</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="logo-container">
                    <img src={logo} alt="GDG Lebanon Logo" className="logo" />
                </div>
                <div className="header-text">
                    <h1>{EVENT_CONFIG.eventName}</h1>
                    <p>{EVENT_CONFIG.eventDescription}</p>
                </div>
            </header>

            <main className="form-wrapper">
                <form onSubmit={handleSubmit} className="single-page-form" noValidate>

                    <section className="form-section">
                        <h2>Access & Security</h2>
                        <FormField label="Secret Code" required error={errors.secretCode}>
                            <input
                                type="text"
                                name="secretCode"
                                placeholder="Enter your VIP or general access code"
                                value={formData.secretCode}
                                onChange={handleChange}
                            />
                        </FormField>
                    </section>

                    <section className="form-section">
                        <h2>Personal Information</h2>
                        <div className="grid-2">
                            <FormField label="First Name" required error={errors.firstName}>
                                <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} />
                            </FormField>
                            <FormField label="Last Name" required error={errors.lastName}>
                                <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} />
                            </FormField>
                        </div>

                        <FormField label="Email" required error={errors.email}>
                            <input type="email" name="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} />
                        </FormField>

                        <div className="grid-2">
                            <FormField label="Phone Number" error={errors.phone}>
                                <input type="tel" name="phone" placeholder="+961 XX XXX XXX" value={formData.phone} onChange={handleChange} />
                            </FormField>
                            <FormField label="LinkedIn Profile Link (Optional)" error={errors.linkedIn}>
                                <input type="url" name="linkedIn" placeholder="https://linkedin.com/in/..." value={formData.linkedIn} onChange={handleChange} />
                            </FormField>
                        </div>

                        <div className="grid-2">
                            <FormField label="Region" required error={errors.region}>
                                <select name="region" value={formData.region} onChange={handleChange}>
                                    <option value="">Select your region</option>
                                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Age Range (Optional)">
                                <select name="ageRange" value={formData.ageRange} onChange={handleChange}>
                                    <option value="">Select age range</option>
                                    <option value="18-23">18 - 23 years</option>
                                    <option value="24-30">24 - 30 years</option>
                                    <option value="30+">30+ years</option>
                                </select>
                            </FormField>
                        </div>

                        <FormField label="Gender (Optional)">
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </FormField>
                    </section>

                    <section className="form-section">
                        <h2>Professional Profile</h2>

                        <FormField label="Your Specialization" required error={errors.specialization}>
                            <select name="specialization" value={formData.specialization} onChange={handleChange}>
                                <option value="">Select specialization</option>
                                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </FormField>

                        <FormField label="Experience / Study Category (Select all that apply)" required error={errors.experience}>
                            <div className="pill-grid">
                                {Object.keys(EXPERIENCE_CATEGORIES).map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        className={`pill-btn ${formData.activeExpCategories.includes(cat) ? 'active' : ''}`}
                                        onClick={() => {
                                            setFormData(prev => {
                                                const cats = prev.activeExpCategories;
                                                const newCats = cats.includes(cat)
                                                    ? cats.filter(c => c !== cat)
                                                    : [...cats, cat];
                                                return { ...prev, activeExpCategories: newCats };
                                            })
                                            if (errors.experience) setErrors(prev => ({ ...prev, experience: null }));
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {formData.activeExpCategories.length > 0 && (
                                <div className="sliders-container">
                                    {formData.activeExpCategories.map(cat => (
                                        <div key={cat} className="experience-slider-group">
                                            <label className="slider-category-label">Select your {cat} level:</label>
                                            <div className="custom-slider-wrapper">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={EXPERIENCE_CATEGORIES[cat].length - 1}
                                                    step="1"
                                                    value={formData.expLevels[cat]}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value, 10);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            expLevels: { ...prev.expLevels, [cat]: val }
                                                        }));
                                                    }}
                                                    className="experience-range"
                                                />
                                                <div className="slider-ticks">
                                                    {EXPERIENCE_CATEGORIES[cat].map((opt, idx, arr) => {
                                                        const total = arr.length > 1 ? arr.length - 1 : 1;
                                                        const percent = (idx / total) * 100;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`slider-tick ${formData.expLevels[cat] === idx ? 'active' : ''}`}
                                                                style={{ left: `${percent}%` }}
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        expLevels: { ...prev.expLevels, [cat]: idx }
                                                                    }));
                                                                }}
                                                            >
                                                                <div className="tick-mark"></div>
                                                                <div className="tick-label">{opt}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </FormField>

                        <FormField
                            label={isProfessionalOrFreshGrad ? "Your current company (Required for badge)" : "Your university"}
                            required
                            error={errors.companySearch}
                        >
                            <div className="search-box">
                                <div className="search-input-wrapper">
                                    <Building2 size={20} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search name or type to add new..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            if (errors.companySearch) setErrors(prev => ({ ...prev, companySearch: null }));
                                        }}
                                    />
                                </div>
                                {isProfessionalOrFreshGrad && (
                                    <span className="form-subtitle" style={{ marginTop: '4px', fontSize: '13px' }}>
                                        Hint: If you are a Freelancer, please write "Freelancer"
                                    </span>
                                )}

                                {searchResults.length > 0 && (
                                    <div className="results-list">
                                        {searchResults.map(result => (
                                            <div
                                                key={result}
                                                className="result-entry"
                                                onClick={() => {
                                                    setFormData({ ...formData, university: result, company: '' })
                                                    setSearchTerm(result)
                                                    setSearchResults([])
                                                }}
                                            >
                                                {result}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showAddCompany && searchTerm.length > 1 && (
                                    <button
                                        type="button"
                                        className="add-new-btn"
                                        onClick={() => {
                                            setFormData({ ...formData, company: searchTerm, university: '' })
                                            setSearchResults([])
                                            setShowAddCompany(false)
                                        }}
                                    >
                                        <Plus size={16} />
                                        <span>Add "<strong>{searchTerm}</strong>" as your institution</span>
                                    </button>
                                )}

                                {(formData.company || formData.university) && !showAddCompany && searchResults.length === 0 && searchTerm === (formData.company || formData.university) && (
                                    <div className="selected-indicator">
                                        <CheckCircle2 size={16} className="icon-green" /> Selected: {searchTerm}
                                    </div>
                                )}
                            </div>
                        </FormField>

                        <div className="badge-preview">
                            <p className="preview-label">Live Badge Preview</p>
                            <div className="badge-card">
                                <div className="badge-name">{formData.firstName || 'Your'} {formData.lastName || 'Name'}</div>
                                <div className="badge-role">
                                    {formData.status === 'professional' ? 'Professional' :
                                        formData.status === 'student' ? 'Student' :
                                            formData.status === 'fresh_graduate' ? 'Fresh Graduate' : 'Attendee'}
                                </div>
                                <div className="badge-company">{formData.company || formData.university || searchTerm || 'Company / University'}</div>
                                <div className="badge-footer">GDG Lebanon RSVP</div>
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <h2>Event Questions & Interests</h2>

                        <FormField label="Have you attended DevFest before?" required error={errors.attendedBefore}>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" name="attendedBefore" value="yes" checked={formData.attendedBefore === 'yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="attendedBefore" value="no" checked={formData.attendedBefore === 'no'} onChange={handleChange} /> No
                                </label>
                            </div>
                        </FormField>

                        <FormField label="How did you hear about DevFest?" required error={errors.referral}>
                            <select name="referral" value={formData.referral} onChange={handleChange}>
                                <option value="">Select source</option>
                                <option value="Social Media">Social Media</option>
                                <option value="University">University</option>
                                <option value="Friends">Friends / Colleagues</option>
                                <option value="GDG Website">GDG Website / Newsletter</option>
                                <option value="Other events">Other community events</option>
                                <option value="Other">Other</option>
                            </select>
                        </FormField>

                        <FormField label="What are your main takeaways? (Select multiple)" required error={errors.takeaways}>
                            <div className="pill-grid">
                                {TAKEAWAYS.map(item => (
                                    <button
                                        key={item}
                                        type="button"
                                        className={`pill-btn ${formData.takeaways.includes(item) ? 'active' : ''}`}
                                        onClick={() => handleMultiSelect('takeaways', item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                            {formData.takeaways.includes("Other") && (
                                <div style={{ marginTop: '12px' }}>
                                    <input
                                        type="text"
                                        name="otherTakeawaysInput"
                                        className={`form-input`}
                                        placeholder="Please specify other takeaways..."
                                        value={formData.otherTakeawaysInput}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </FormField>

                        <FormField label="Please select the technologies you are interested in (Optional)">
                            <div className="pill-grid">
                                {TECH_INTERESTS.map(tech => (
                                    <button
                                        key={tech}
                                        type="button"
                                        className={`pill-btn ${formData.techInterests.includes(tech) ? 'active' : ''}`}
                                        onClick={() => handleMultiSelect('techInterests', tech)}
                                    >
                                        {tech}
                                    </button>
                                ))}
                            </div>
                            {formData.techInterests.includes("Other") && (
                                <div style={{ marginTop: '12px' }}>
                                    <input
                                        type="text"
                                        name="otherTechInterestInput"
                                        className={`form-input`}
                                        placeholder="Please specify other tech interests..."
                                        value={formData.otherTechInterestInput}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </FormField>
                    </section>

                    <section className="form-section attendance-section">
                        <h2>Attendance & Networking Details</h2>
                        <p className="form-subtitle">Knowing your expected stay helps us reduce food waste and manage seating effectively.</p>

                        <FormField label="Expected Attendance Type" required error={errors.attendanceType}>
                            <div className="attendance-grid">
                                <button
                                    type="button"
                                    className={`attendance-card ${formData.attendanceType === 'full_day' ? 'active' : ''}`}
                                    onClick={() => {
                                        setFormData({ ...formData, attendanceType: 'full_day' });
                                        if (errors.attendanceType) setErrors(prev => ({ ...prev, attendanceType: null }));
                                    }}
                                >
                                    <div className="card-top">
                                        <Clock className="icon-blue" />
                                        <div className="card-text">
                                            <strong>Full Day Experience</strong>
                                            <span>Attend all sessions and networking events.</span>
                                        </div>
                                    </div>
                                    <div className="card-tag neutral">Standard Selection | Includes guaranteed lunch and swag</div>
                                </button>

                                <button
                                    type="button"
                                    className={`attendance-card ${formData.attendanceType === 'few_hours' ? 'active' : ''}`}
                                    onClick={() => {
                                        setFormData({ ...formData, attendanceType: 'few_hours' });
                                        if (errors.attendanceType) setErrors(prev => ({ ...prev, attendanceType: null }));
                                    }}
                                >
                                    <div className="card-top">
                                        <Clock className="icon-green" />
                                        <div className="card-text">
                                            <strong>Flash Attendee (Few Hours)</strong>
                                            <span>Quick visit to catch specific talks.</span>
                                        </div>
                                    </div>
                                    <div className="card-tag high">Higher Chance of Selection | Includes a guarantee of 1 workshop seat</div>
                                </button>

                                <button
                                    type="button"
                                    className={`attendance-card ${formData.attendanceType === 'networking' ? 'active' : ''}`}
                                    onClick={() => {
                                        setFormData({ ...formData, attendanceType: 'networking' });
                                        if (errors.attendanceType) setErrors(prev => ({ ...prev, attendanceType: null }));
                                    }}
                                >
                                    <div className="card-top">
                                        <Users className="icon-yellow" />
                                        <div className="card-text">
                                            <strong>Networking Focused (Visitor)</strong>
                                            <span>Focus on making connections in the lobby and expo.</span>
                                        </div>
                                    </div>
                                    <div className="card-tag high">Higher Chance of Selection | Skip guaranteed session seating</div>
                                </button>

                                <button
                                    type="button"
                                    className={`attendance-card ${formData.attendanceType === 'afternoon' ? 'active alert' : ''}`}
                                    onClick={() => {
                                        setFormData({ ...formData, attendanceType: 'afternoon' });
                                        if (errors.attendanceType) setErrors(prev => ({ ...prev, attendanceType: null }));
                                    }}
                                    style={formData.attendanceType === 'afternoon' ? { borderColor: 'var(--google-red)', backgroundColor: 'rgba(234, 67, 53, 0.05)' } : {}}
                                >
                                    <div className="card-top">
                                        <Sunset className="icon-red" />
                                        <div className="card-text">
                                            <strong>Afternoon attendee</strong>
                                            <span>Access only starting 13:30 till the end of the day.</span>
                                        </div>
                                    </div>
                                    <div className="card-tag danger">Limited Access</div>
                                </button>
                            </div>
                        </FormField>

                        <div className="disclaimer-alert">
                            <Utensils size={28} className="icon" />
                            <p>Important Note: Meals are guaranteed only for Full Day Experience attendees availability. Opting for a shorter, more targeted visit helps us accommodate more attendees and increases your chances of being selected! Swags depends on availability.</p>
                        </div>

                        <FormField label="Additional Comments / 5min demo proposal (Optional)">
                            <textarea
                                name="comments"
                                rows="3"
                                placeholder="Any suggestions, topics you'd like to hear about, or propose a 5min demo..."
                                value={formData.comments}
                                onChange={handleChange}
                            ></textarea>
                        </FormField>
                    </section>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-primary btn-large"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit RSVP'} <Send size={18} />
                        </button>
                    </div>

                </form>
            </main>
        </div>
    )
}

export default App
