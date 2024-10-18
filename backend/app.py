from flask import Flask, jsonify, make_response, request
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from datetime import datetime
from models import db, Doctor, Department, Patient, Appointment, Medication, MedicalRecord
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "lqiithudbrnydirfkshrp" 

jwt = JWTManager(app)

CORS(app)

migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)

@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if username != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)


class Index(Resource):
    def get(self):
        body = {
            "index": "Welcome to the hospital system"
        }

        response = make_response(body, 200)

        return response


api.add_resource(Index, '/')


class Doctors(Resource):
    def get(self):
        doctors = Doctor.query.all()
        doctors_list = []

        for doctor in doctors:
            doctors_list.append(doctor.to_dict())

        body = {
            "count": len(doctors_list),
            "doctors": doctors_list
        }

        return make_response(body, 200)

    def post(self):
        new_doctor = Doctor(
            name=request.json.get("name"),
            email=request.json.get("email"),
            speciality=request.json.get("speciality")
        )

        db.session.add(new_doctor)
        db.session.commit()

        response = make_response(new_doctor.to_dict(), 201)

        return response


api.add_resource(Doctors, '/doctors')

class DoctorsByID(Resource):
    def get(self, id):
        doctor = Doctor.query.filter_by(id=id).first()

        if doctor == None:
            body = {
                "message": "This record does not exist in our database. Please try again."
            }
            response = make_response(body, 404)

            return response
        else:
            doctor_dict = doctor.to_dict()

            response = make_response(doctor_dict, 200)

            return response
        
    def patch(self, id):
        doctor = Doctor.query.filter_by(id=id).first()

        for attr in request.json:
            setattr(doctor, attr, request.json.get(attr))

        db.session.add(doctor)
        db.session.commit()

        doctor_dict = doctor.to_dict()

        response = make_response(doctor_dict, 200)

        return response

    def delete(self, id):
        doctor = Doctor.query.filter_by(id=id).first()

        db.session.delete(doctor)
        db.session.commit()

        body = {
            "message": "doctor deleted."
        }

        response = make_response(body, 200)

        return response


api.add_resource(DoctorsByID, '/doctors/<int:id>')

class Departments(Resource):
    def get(self):
        department = Department.query.all()
        departments_list = []

        for department in department:
            departments_list.append(department.to_dict())

        body = {
            "count": len(departments_list),
            "departments": departments_list
        }

        return make_response(body, 200)

    def post(self):
        new_department = Department(
            department_name=request.json.get("department_name"),
        )

        db.session.add(new_department)
        db.session.commit()

        response = make_response(new_department.to_dict(), 201)

        return response


api.add_resource(Departments, '/departments')

class DepartmentsByID(Resource):
    def get(self, id):
        department = Department.query.filter_by(id=id).first()

        if department == None:
            body = {
                "message": "This record does not exist in our database. Please try again."
            }
            response = make_response(body, 404)

            return response
        else:
            department_dict = department.to_dict()

            response = make_response(department_dict, 200)

            return response
        
    def patch(self, id):
        department = Department.query.filter_by(id=id).first()

        for attr in request.json:
            setattr(department, attr, request.json.get(attr))

        db.session.add(department)
        db.session.commit()

        department_dict = department.to_dict()

        response = make_response(department_dict, 200)

        return response

    def delete(self, id):
        department = Department.query.filter_by(id=id).first()

        db.session.delete(department)
        db.session.commit()

        body = {
            "message": "department deleted."
        }

        response = make_response(body, 200)

        return response


api.add_resource(DepartmentsByID, '/departments/<int:id>')

class Patients(Resource):
    def get(self):
        patients = Patient.query.all()
        patients_list = [patient.to_dict() for patient in patients]

        body = {
            "count": len(patients_list),
            "patients": patients_list
        }

        return make_response(body, 200)

    def post(self):
        try:
            new_patient = Patient(
                name=request.json.get("name"),
                age=request.json.get("age"),
                gender=request.json.get("gender"),
                date=datetime.strptime(request.json.get("date"), '%Y-%m-%d').date() if request.json.get("date") else None,
            )
            db.session.add(new_patient)
            db.session.commit()
            response = make_response(new_patient.to_dict(), 201)
            return response
        except Exception as e:
            db.session.rollback()
            body = {"message": f"An error occurred: {str(e)}"}
            return make_response(body, 400)

api.add_resource(Patients, '/patients')

class PatientsByID(Resource):
    def get(self, id):
        patient = Patient.query.filter_by(id=id).first()
        if not patient:
            body = {"message": "This record does not exist in our database. Please try again."}
            return make_response(body, 404)
        return make_response(patient.to_dict(), 200)

    def patch(self, id):
        patient = Patient.query.filter_by(id=id).first()
        if not patient:
            body = {"message": "This record does not exist in our database. Please try again."}
            return make_response(body, 404)

        try:
            for attr, value in request.json.items():
                if attr == "date":
                    value = datetime.strptime(value, '%Y-%m-%d').date() if value else None
                setattr(patient, attr, value)

            db.session.add(patient)
            db.session.commit()
            return make_response(patient.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            body = {"message": f"An error occurred: {str(e)}"}
            return make_response(body, 400)

    def delete(self, id):
        patient = Patient.query.filter_by(id=id).first()
        if not patient:
            body = {"message": "This record does not exist in our database. Please try again."}
            return make_response(body, 404)

        db.session.delete(patient)
        db.session.commit()
        body = {"message": "Patient deleted."}
        return make_response(body, 200)

api.add_resource(PatientsByID, '/patients/<int:id>')

class Appointments(Resource):
    def get(self):
        appointments = Appointment.query.all()
        appointments_list = [appointment.to_dict() for appointment in appointments]

        body = {
            "count": len(appointments_list),
            "appointments": appointments_list
        }

        return make_response(body, 200)

    def post(self):
        try:
            new_appointment = Appointment(
                doctor_id=request.json.get("doctor_id"),
                patient_id=request.json.get("patient_id"),
                appointment_date=datetime.strptime(request.json.get("appointment_date"), '%Y-%m-%d').date() if request.json.get("appointment_date") else None,
            )
            db.session.add(new_appointment)
            db.session.commit()
            response = make_response(new_appointment.to_dict(), 201)
            return response
        except Exception as e:
            db.session.rollback()
            body = {"message": f"An error occurred: {str(e)}"}
            return make_response(body, 400)

api.add_resource(Appointments, '/appointments')

class AppointmentsByID(Resource):
    def get(self, id):
        appointment = Appointment.query.filter_by(id=id).first()
        if not appointment:
            body = {"message": "This record does not exist in our database. Please try again."}
            return make_response(body, 404)
        return make_response(appointment.to_dict(), 200)

    def patch(self, id):
        appointment = Appointment.query.filter_by(id=id).first()
        if not appointment:
            body = {"message": "This record does not exist in our database. Please try again."}
            return make_response(body, 404)

        try:
            for attr, value in request.json.items():
                if attr == "appointment_date":
                    value = datetime.strptime(value, '%Y-%m-%d').date() if value else None
                setattr(appointment, attr, value)

            db.session.add(appointment)
            db.session.commit()
            return make_response(appointment.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            body = {"message": f"An error occurred: {str(e)}"}
            return make_response(body, 400)

    def delete(self, id):
        appointment = Appointment.query.filter_by(id=id).first()
        if not appointment:
            body = {"message": "This record does not exist in our database. Please try again."}
            return make_response(body, 404)

        db.session.delete(appointment)
        db.session.commit()
        body = {"message": "Appointment deleted."}
        return make_response(body, 200)

api.add_resource(AppointmentsByID, '/appointments/<int:id>')

class Medications(Resource):
    def get(self):
        medications = Medication.query.all()
        medications_list = []

        for medication in medications:
            medications_list.append(medication.to_dict())

        body = {
            "count": len(medications_list),
            "medications": medications_list
        }

        return make_response(body, 200)

    def post(self):
        new_medication = Medication(
            medication_name=request.json.get("medication_name"),
            dosage=request.json.get("dosage")
        )

        db.session.add(new_medication)
        db.session.commit()

        response = make_response(new_medication.to_dict(), 201)

        return response

api.add_resource(Medications, '/medications')

class MedicationsByID(Resource):
    def get(self, id):
        medication = Medication.query.get(id)
        if medication is None:
            return make_response(jsonify(message="This record does not exist in our database. Please try again."), 404)
        return make_response(jsonify(medication.to_dict()), 200)

    def patch(self, id):
        medication = Medication.query.get(id)
        if medication is None:
            return make_response(jsonify(message="This record does not exist in our database. Please try again."), 404)
        
        data = request.get_json()
        if not data:
            return make_response(jsonify(message="No input data provided"), 400)

        for attr, value in data.items():
            if hasattr(medication, attr):
                setattr(medication, attr, value)

        db.session.commit()
        return make_response(jsonify(medication.to_dict()), 200)

    def delete(self, id):
        medication = Medication.query.filter_by(id=id).first()

        db.session.delete(medication)
        db.session.commit()

        body = {
            "message": "medication deleted."
        }

        response = make_response(body, 200)

        return response
    
api.add_resource(MedicationsByID, '/medications/<int:id>')


class Medicalrecords(Resource):
    def get(self):
        medicalrecord = MedicalRecord.query.all()
        medicalrecord_list = []

        for medicalrecord in medicalrecord:
            medicalrecord_list.append(medicalrecord.to_dict())

        body = {
            "count": len(medicalrecord_list),
            "medical_record": medicalrecord_list
        }

        return make_response(body, 200)

    def post(self):
        new_medicalrecord = MedicalRecord(
            patient_id=request.json.get("patient_id"),
            medication_id=request.json.get("medication_id"),
            diagnosis=request.json.get("diagnosis")
        )

        db.session.add(new_medicalrecord)
        db.session.commit()

        response = make_response(new_medicalrecord.to_dict(), 201)

        return response


api.add_resource(Medicalrecords, '/medicalrecords')

class MedicalrecordsByID(Resource):
    def get(self, id):
        medicalrecord = MedicalRecord.query.filter_by(id=id).first()

        if medicalrecord == None:
            body = {
                "message": "This record does not exist in our database. Please try again."
            }
            response = make_response(body, 404)

            return response
        else:
            medicalrecord_dict = medicalrecord.to_dict()

            response = make_response(medicalrecord_dict, 200)

            return response
        
    def patch(self, id):
        medicalrecord = MedicalRecord.query.filter_by(id=id).first()

        for attr in request.json:
            setattr(medicalrecord, attr, request.json.get(attr))

        db.session.add(medicalrecord)
        db.session.commit()

        medicalrecord_dict = medicalrecord.to_dict()

        response = make_response(medicalrecord_dict, 200)

        return response

    def delete(self, id):
        medicalrecord = MedicalRecord.query.filter_by(id=id).first()

        db.session.delete(medicalrecord)
        db.session.commit()

        body = {
            "message": "medicalrecord deleted."
        }

        response = make_response(body, 200)

        return response


api.add_resource(MedicalrecordsByID, '/medicalrecords/<int:id>')

if __name__ == "__main__":
    app.run(port=5555, debug=True)