import json
import sys
import datetime

class Loan():
    def __init__(self, id, amount, interest_rate, sub, grad_date):
        self.id = id
        self.amount = float(amount)
        self.interest_rate = float(interest_rate)
        self.subsidized = bool(sub)
        self.months_till_grad = self.parse_date(grad_date)
    def parse_date(date_string):
        # input = 05 2019 for May 2019
        month, year = date_string.split()
        today = datetime.date.today()
        grad = datetime.date(int(year), int(month), 30)
        today_months = today.year*12+today.month
        grad_months = grad.year*12+grad.month
        return grad_months-today_months if grad_months > today_months else 0

class Payment_Plan():
    def __init__(self):
        self.loans = []
    def read_json(self, data):
        json_object = json.loads(data)
        self.monthly_payment = float(json_object['monthly payment'])
        self.number_of_months = float(json_object['num months'])
        loan_number = 0
        for loan in json_object['loans']:
            self.loans.append(Loan(loan_number, loan['amount'], loan['interest'], loan['subsidized'], loan['grad date']))
            loan_number += 1
        print(self.loans)
    def consolidate(self):
        self.principal = sum([loan.amount for loan in self.loans])
        self.avg_interest = sum([loan.interest for loan in self.loans]/len(loans))
        print(self.principal)
        print(self.avg_interest)
    def months_to_pay(self):
        pass
    def monthly_payment(self):
        pass
    def graph1_data(self):
        pass
    def make_json(self):
        data = {}
        data['principal'] = self.principal
        data['avg interest'] = self.avg_interest
        data['graphs']['graph1'] = self.graph1_data()
        return json.dumps(data)

PP = Payment_Plan()
PP.read_json(sys.argv[1])
PP.consolidate()
# PP.make_json()

# {"monthly payment": 200, "num months": 0, "loans": [{"amount": 5000, "interest": 5, "grad date": 2016}, {"amount": 6000, "interest": 4.5, "grad date": 2016}]}