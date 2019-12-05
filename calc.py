import json
import sys
import datetime

class Loan():
    def __init__(self, id, amount, interest_rate, sub):
        self.id = id
        self.amount = float(amount)
        self.interest_rate = float(interest_rate)
        self.subsidized = bool(sub)

class Payment_Plan():
    def __init__(self):
        self.loans = []
    def parse_date(self, date_string):
        # input = '5 2019' for May 2019
        month, year = date_string.split()
        today = datetime.date.today()
        grad = datetime.date(int(year), int(month), 30)
        today_months = today.year*12+today.month
        grad_months = grad.year*12+grad.month
        return grad_months-today_months if grad_months > today_months else 0
    def read_json(self, data):
        json_object = json.loads(data)
        self.monthly_payment = float(json_object["monthly_payment"])    # 0 if months entered
        self.grad_date = self.parse_date(json_object["grad_date"])
        loan_number = 0
        for loan in json_object["loans"]:
            self.loans.append(Loan(loan_number, loan["amount"], loan["interest"], loan["subsidized"]))
            loan_number += 1
    def consolidate(self):
        self.principal = sum([loan.amount for loan in self.loans])
        weights = {loan.id: loan.amount/self.principal for loan in self.loans}
        self.avg_interest = sum([loan.interest_rate for loan in self.loans])/len(self.loans)
        self.weight_avg_interest = sum([loan.interest_rate*weights[loan.id] for loan in self.loans])
    def calc_months_consolidated(self):
        num_months = 0
        total = self.principal
        total_paid = 0
        while total > 0:    #until fully paid off
            total = total*(1+self.avg_interest/(100*365))**(365/12)
            num_months += 1
            total-=self.monthly_payment
            total_paid += self.monthly_payment if total > 0 else self.monthly_payment + total
        self.consolidated_total_paid = total_paid
        self.consolidated_months = num_months
    def score_loan(self, loan):
        return loan.amount * (1+loan.interest_rate/100)
    def rank_loans(self):
        loan_scores = {loan: self.score_loan(loan) for loan in self.loans}
        loan_rankings = sorted(loan_scores.items(), key=lambda x: x[1], reverse=True)
        return loan_rankings    #[loan: score] from highest score to lowest
    # def calc_months_highest_first(self):
    #     num_months = 0
    #     left_to_pay = {loan: loan.amount for loan in self.loans}
    #     total_paid = 0
    #     total = sum([left_to_pay[loan] for loan in self.loans])
    #     while total > 0:
    #         ranked_loans = self.rank_loans() #[loan: score] from highest score to lowest
    #         left_to_pay[ranked_loans[0]] -= self.monthly_payment
    #         for loan in self.loans:
    #             left_to_pay[loan] = left_to_pay[loan]*(1+loan.interest_rate/(100*365))**(365/12) #add daily interest for the month
    #         num_months += 1
    #     self.highest_first_months = num_months
    # def calc_months_weighted(self):
    #     num_months = 0
    #     self.weighted_months = num_months
    def graph1_data(self):
        pass
    def make_json(self):
        data = {}
        data["graphs"] = {}
        data["principal"] = self.principal
        data["weighted_avg_interest"] = self.weight_avg_interest
        data["consolidated_months"] = self.consolidated_months
        data["consolidated_total_paid"] = self.consolidated_total_paid
        data["graphs"]["graph1"] = self.graph1_data()
        return json.dumps(data)

PP = Payment_Plan()
PP.read_json(sys.argv[1])
PP.consolidate()
PP.calc_months_consolidated()
# PP.calc_months_highest_first()
# PP.calc_months_weighted()
print(PP.principal, PP.consolidated_total_paid, PP.monthly_payment, PP.consolidated_months)
# PP.make_json()

# '{"monthly_payment": 200, "grad_date": "5 2016", "loans": [{"amount": 5000, "interest": 5, "subsidized": true}, {"amount": 6000, "interest": 4.5, "subsidized": false}]}'