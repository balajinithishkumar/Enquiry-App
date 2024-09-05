import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PickupBooking from './PickupBooking';
import RateCardForm from './RateCard';
import VendorRateCard from './VendorRateCard';
import PaymentConfirm from './PaymentConfirm';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<PickupBooking />} />
          <Route path="/Sale-rates" element={<RateCardForm />} />
          <Route path="/Vendor-rates" element={<VendorRateCard />} />
          <Route path="/Payment-confirm" element={<PaymentConfirm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;