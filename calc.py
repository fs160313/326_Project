import json
import sys

class Loan():
    def __init__(self, id, amount, interest_rate, sub, grad_date):
        self.id = id
        self.amount = amount
        self.interest_rate = interest_rate
        self.subsidized = sub
        self.grad_date = grad_date

class Payment_Plan():
    def __init__(self):
        self.loans = []
        self.read_json()
    def read_json():
        data = json.loads(sys.argv[1])
        self.monthly_payment = data['monthly_payment']
        self.number_of_months = data['num_months']
        loan_number = 0
        for loan in data['loans']:
            self.loans.append(Loan(loan_number, loan['amount'], loan['interest'], loan['sunsidized'], loan['grad_date']))
            loan_number += 1