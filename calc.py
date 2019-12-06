import json
import sys
import datetime

class Loan():
    def __init__(self, id, amount, interest_rate, sub):
        self.id = id
        self.amount = float(amount)
        self.interest_rate = float(interest_rate)
        self.subsidized = bool(sub)

class Calculator():
    def __init__(self, PP):
        self.PP = PP
    def score_loan(self, loan):
        return loan.amount * (1+loan.interest_rate/100)
    def rank_loans(self):
        loan_scores = {loan: self.score_loan(loan) for loan in self.PP.loans}
        loan_rankings = sorted(loan_scores.items(), key=lambda x: x[1], reverse=True)
        return loan_rankings    #[loan: score] from highest score to lowest
    def accrue_interest(self, months_passed):
        for loan in self.PP.loans:
            if loan.subsidized:
                if PP.today_months + months_passed > self.PP.grad_date:
                    loan.left_to_pay = loan.left_to_pay*(1+loan.interest_rate/(100*365))**(365/12) #add daily interest for the month
            else:
                loan.left_to_pay = loan.left_to_pay*(1+loan.interest_rate/(100*365))**(365/12) #add daily interest for the month
    def calc_months_consolidated(self):
        num_months = 0
        total = self.PP.principal
        total_paid = 0
        while total > 0:    #until fully paid off
            total = total*(1+self.PP.avg_interest/(100*365))**(365/12)
            num_months += 1
            total-=self.PP.monthly_payment
            total_paid += self.PP.monthly_payment if total > 0 else self.PP.monthly_payment + total
        return num_months, total_paid
    def calc_months_highest_first(self):
        num_months = 0
        total_paid = 0
        for loan in self.PP.loans:
            loan.left_to_pay = loan.amount
        while sum([loan.left_to_pay for loan in self.PP.loans]) > 0: #while there is still some loans to pay
            ranked_loans = self.rank_loans() #[loan: score] from highest score to lowest
            money_left = self.PP.monthly_payment #start with entire monthly payment
            for loan, score in ranked_loans:
                if loan.left_to_pay > money_left:
                    loan.left_to_pay -= money_left
                    total_paid += money_left
                    money_left = 0
                else:
                    total_paid += loan.left_to_pay
                    money_left -= loan.left_to_pay
                    loan.left_to_pay = 0
            self.accrue_interest(num_months)
            num_months += 1
        return num_months, total_paid
    def calc_months_weighted(self):
        num_months = 0
        total_paid = 0
        for loan in self.PP.loans:
            loan.left_to_pay = loan.amount
        while sum([loan.left_to_pay for loan in self.PP.loans]) > 0: #while there is still some loans to pay
            ranked_loans = self.rank_loans()                         #[loan: score] from highest score to lowest
            money_left = self.PP.monthly_payment                     #start with entire monthly payment
            for loan, score in ranked_loans:
                normalized_score = score/sum([score for (loan, score) in ranked_loans])
                loan.left_to_pay -= self.PP.monthly_payment*normalized_score
                total_paid +=  self.PP.monthly_payment*normalized_score
            self.accrue_interest(num_months)
            num_months += 1
        return num_months, total_paid

class Payment_Plan():
    def __init__(self):
        self.loans = []
    def read_json(self, data):
        json_object = json.loads(data)
        self.monthly_payment = float(json_object["monthly_payment"])
        self.parse_date(json_object["grad_date"])
        loan_number = 0
        for loan in json_object["loans"]:
            self.loans.append(Loan(loan_number, loan["amount"], loan["interest"], loan["subsidized"]))
            loan_number += 1
    def parse_date(self, date_string):
        # input = '5 2019' for May 2019
        month, year = date_string.split()
        today = datetime.date.today()
        grad = datetime.date(int(year), int(month), 30)
        self.today_months = today.year*12+today.month
        self.grad_date = grad.year*12+grad.month
    def consolidate(self):
        self.principal = sum([loan.amount for loan in self.loans])
        weights = {loan.id: loan.amount/self.principal for loan in self.loans}
        self.avg_interest = sum([loan.interest_rate for loan in self.loans])/len(self.loans)
        self.weight_avg_interest = sum([loan.interest_rate*weights[loan.id] for loan in self.loans])
    def calculate(self):
        Calc = Calculator(self)
        self.consolidated_months, self.consolidated_total_paid = Calc.calc_months_consolidated()
        self.highest_first_months, self.highest_first_total = Calc.calc_months_highest_first()
        self.weighted_months, self.weighted_total = Calc.calc_months_weighted()
    def make_graphs(self):
        self.pie_chart_consolidated = []
        self.pie_chart_highest_first = []
        self.pie_chart_weighted = []
        # total_over_monthly_consolidated = []
        # total_over_monthly_highest_first = []
        # total_over_monthly_weighted = []
    def make_json(self):
        self.make_graphs()
        data = {}
        data["graphs"] = {}
        data["principal"] = self.principal
        data["weighted_avg_interest"] = self.weight_avg_interest
        data["consolidated_months"] = self.consolidated_months
        data["consolidated_total_paid"] = self.consolidated_total_paid
        data["consolidated_total_interest"] = self.consolidated_total_paid - self.principal
        data["highest_first_months"] = self.highest_first_months
        data["highest_first_total_paid"] = self.highest_first_total
        data["highest_first_total_interest"] = self.highest_first_total - self.principal
        data["weighted_months"] = self.weighted_months
        data["weighted_total_paid"] = self.weighted_total
        data["weighted_total_interest"] = self.weighted_total - self.principal
        data["graphs"]["pie_chart_consolidated"] = self.pie_chart_consolidated
        data["graphs"]["pie_chart_highest_first"] = self.pie_chart_highest_first
        data["graphs"]["pie_chart_weighted"] = self.pie_chart_weighted
        return json.dumps(data)

PP = Payment_Plan()
PP.read_json(sys.argv[1])
PP.consolidate()
PP.calculate()
print('principal = {}, monthly payment = {}'.format(PP.principal, PP.monthly_payment))
print('consolidated total = {}, consolidated months = {}'.format(PP.consolidated_total_paid, PP.consolidated_months))
print('highest first total = {}, highest first months = {}'.format(PP.highest_first_total, PP.highest_first_months))
print('weighted total = {}, weighted months = {}'.format(PP.weighted_total, PP.weighted_months))
PP.make_json()
# '{"monthly_payment": 200, "grad_date": "5 2016", "loans": [{"amount": 5000, "interest": 5, "subsidized": true}, {"amount": 6000, "interest": 4.5, "subsidized": false}]}'