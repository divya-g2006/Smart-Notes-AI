import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector } from 'react-redux';

function Pricing() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [paying, setPaying] = useState(false);
const [payingAmount, setPayingAmount] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  const upiId = "8940307512@ibl";
  const creditMap = {
    100: 50,
    200: 120,
    500: 300
  };

  const selectedCredits = selectedPrice ? creditMap[selectedPrice] : null;
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Divya")}`;
  const qrUrl = selectedPrice
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`
    : "";

const handlePaying = async (amount) => {
  try {
    setPayingAmount(amount)
    setSelectedPrice(amount)
    setSubmitted(false)
    setSubmitMsg("")
    setTransactionId("")
  } catch (error) {
        console.log(error)
  }
}

const handleSubmitPayment = async () => {
  try {
    if (!selectedPrice) return;
    const credits = creditMap[selectedPrice];
    if (!credits) return;

    if (!transactionId.trim()) {
      setSubmitMsg("Please enter Transaction ID (UTR).")
      return;
    }

    setPayingAmount(null)
    setPaying(true)
    setSubmitMsg("")

    await axios.post(
      serverUrl + "/api/credit/request",
      {
        userId: userData?._id || null,
        amount: selectedPrice,
        credits,
        transactionId: transactionId.trim()
      },
      { withCredentials: true }
    );

    setSubmitted(true)
    setSubmitMsg("Waiting for payment verification")
    setPaying(false)
  } catch (error) {
    setPaying(false)
    setSubmitMsg("Submission failed. Please try again.")
    console.log(error)
  }
}
  return (
    <div className='min-h-screen bg-gray-100 px-6 py-10 relative'>

      <button onClick={()=>navigate("/")} className='flex items-center gap-2 text-gray-600 hover:text-black mb-6'>
        ⬅️ Back
      </button>

      <motion.div 
      initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10">
          <h1 className="text-3xl font-bold">Buy Credits</h1>
        <p className="text-gray-600 mt-2">
          Choose a plan that fits your study needs
        </p>

      </motion.div>

      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>

        <PricingCard 
        title="Starter"
          price="₹100"
          amount={100}
          credits="50 Credits"
          description="Perfect for quick revisions"
          features={[
            "Generate AI notes",
            "Exam-focused answers",
            "Diagram & charts support",
            "Fast generation"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
         />


          <PricingCard
          popular
          title="Popular"
          price="₹200"
          amount={200}
          credits="120 Credits"
          description="Best value for students"
          features={[
            "All Starter features",
            "More credits per ₹",
            "Revision mode access",
            "Priority AI response"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />

        <PricingCard
          title="Pro Learner"
          price="₹500"
          amount={500}
          credits="300 Credits"
          description="For serious exam preparation"
          features={[
            "Maximum credit value",
            "Unlimited revisions",
            "Charts & diagrams",
            "Ideal for full syllabus"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />

      </div>

      {/* Manual UPI Payment */}
      {selectedPrice && (
        <div className="max-w-5xl mx-auto mt-10">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">Pay via UPI</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Selected plan: <span className="font-semibold">₹{selectedPrice}</span> →{" "}
                  <span className="font-semibold">{selectedCredits} credits</span>
                </p>

                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">UPI ID</p>
                  <p className="mt-1 font-mono text-base text-gray-900">{upiId}</p>
                </div>

                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Instructions</p>
                  <ol className="list-decimal ml-5 space-y-1 text-sm text-gray-700">
                    <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                    <li>Scan the QR and enter the amount manually</li>
                    <li>Complete the payment</li>
                    <li>Enter Transaction ID (UTR) below</li>
                  </ol>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">Enter Transaction ID</label>
                  <input
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 123456789012"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900/10"
                    disabled={submitted}
                  />
                  {submitMsg && (
                    <p className={`mt-2 text-sm ${submitted ? "text-green-700" : "text-red-600"}`}>
                      {submitMsg}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSubmitPayment}
                  disabled={paying || submitted}
                  className={`mt-5 w-full md:w-auto px-6 py-3 rounded-xl font-medium transition
                    ${submitted
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : paying
                      ? "bg-gray-300 text-gray-700 cursor-wait"
                      : "bg-black text-white hover:bg-gray-900"}
                  `}
                >
                  {submitted ? "Waiting for payment verification" : paying ? "Submitting..." : "Submit for Verification"}
                </button>
              </div>

              <div className="shrink-0">
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Scan QR</p>
                  <img
                    src={qrUrl}
                    alt="UPI QR"
                    className="w-[240px] h-[240px] object-contain"
                  />
                  <p className="mt-3 text-xs text-gray-500">
                    After payment, enter your UTR above and submit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}


function PricingCard({
  title,
  price,
  amount,
  credits,
  description,
  features,
  popular,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount
}){

    const isSelected = selectedPrice === amount;
const isPayingThisCard = paying && payingAmount === amount;
return(
  
  <motion.div  
  onClick={()=>setSelectedPrice(amount)}
  whileHover={{ y: -4 }}
      className={`
        relative cursor-pointer
        rounded-xl p-6 bg-white
        border transition
        ${isSelected
          ? "border-black"
          : popular
          ? "border-indigo-500"
          : "border-gray-200"}
      `}>
       {popular && !isSelected && <span className='absolute top-4 right-4 text-xs px-2 py-1 rounded bg-indigo-600 text-white'>Popular</span>}

      {isSelected && <span className='absolute top-4 right-4 text-xs px-2 py-1 rounded bg-black text-white'>
        Seleted
       </span>}


       <h2 className='text-xl font-semibold'>{title}</h2>
       <p className='text-sm text-gray-500 mt-1'>{description}</p>

       <div className='mt-4'>
        <p className="text-3xl font-bold">{price}</p>
        <p className="text-sm text-indigo-600">{credits}</p>
       </div>
        <button 
        disabled={isPayingThisCard}

        onClick={(e)=>{
          e.stopPropagation();
          onBuy(amount)
        }}
        className={`
          w-full mt-5 py-2 rounded-lg font-medium transition
          ${isPayingThisCard
            ? "bg-gray-300 cursor-not-allowed"
            : isSelected
            ? "bg-black text-white"
            : "bg-indigo-600 text-white hover:bg-indigo-700"}
        `}>
{isPayingThisCard ? "Redirecting..." : "Buy Now"}
        </button>

        <ul className='mt-5 space-y-2 text-sm text-gray-600'>
          {features.map((f, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-green-600">✓</span>
            {f}
          </li>
        ))}
        </ul>

  </motion.div>
)
}

export default Pricing
