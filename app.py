import os
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify , send_from_directory
from werkzeug.utils import secure_filename
import pymysql , datetime
import bcrypt
import uuid
import mysql.connector

app = Flask(__name__)
app.secret_key = 'your_secret_key' 
app.config['SECRET_KEY'] = 'your_strong_secret_key'  # Replace with a strong, randomly generated key
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234567890' 
app.config['MYSQL_DB'] = 'routine_management'
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif' , 'svg'}


db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234567890',
    'database': 'routine_management'
}



def get_db_connection():
    try:
        return pymysql.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            database=app.config['MYSQL_DB'],
            cursorclass=pymysql.cursors.DictCursor
        )
        
    except pymysql.Error as e:
        print(f"Database connection error: {e}")
        return None



def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(password, hashed_password):
    password = password.encode('utf-8')
    hashed_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password, hashed_password)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET'])
def index():
    return render_template('homepage.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')  # From HTML form
        password = request.form.get('password')

        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password required'}), 400

        conn = get_db_connection()
        if conn is None:
            return jsonify({'success': False, 'message': 'Database connection error'}), 500

        try:
            with conn.cursor() as cursor:
                # Get teacher by email
                cursor.execute("SELECT * FROM teachers WHERE email = %s", (email,))
                teacher = cursor.fetchone()

                if not teacher:
                    error = "Account not found"
                    return render_template('login.html', error=error)
                
                elif not check_password(password, teacher['password']):
                    error = "Wrong password"
                    return render_template('login.html', error=error)

                else:
                    # Login successful
                    session['user_id'] = teacher['teacher_id']
                    session['email'] = teacher['email']
                    session['name'] = teacher['name']
                    session['is_coordinator'] = teacher['is_coordinator']
                    return redirect(url_for('dashboard'))

        except pymysql.Error as e:
            return jsonify({'success': False, 'message': f'Database error: {e}'}), 500

        finally:
            conn.close()

    return render_template('login.html')



@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        data = request.form
        
        firstname = data.get('firstname', '').strip()
        lastname = data.get('lastname', '').strip()
        email = data.get('email', '').strip()
        department = data.get('department', '').strip()
        designation = data.get('designation', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')
        
        # Server-side validations
        if not all([firstname, lastname, email, department, designation, password, confirm_password]):
            error = "All feilds need to filled"
            return render_template('signup.html' ,error=error)
        
        if password != confirm_password:
            error = 'Passwords do not match'
            return render_template('signup.html',error=error)
        
        import re
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            error = 'Invalid email address'
            return render_template('signup.html', error=error)
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        conn = get_db_connection()
        if conn is None:
            return render_template('signup.html')
        
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM teachers WHERE email = %s", (email,))
                if cursor.fetchone():
                    error = "Email already registered"
                    return render_template('signup.html',error=error)
                
                cursor.execute("""
                    INSERT INTO teachers (name, email,password , designation , dept_name)
                    VALUES (%s, %s, %s,%s, %s)
                """, (firstname + ' ' + lastname, email, hashed_password , designation , department))
                
                conn.commit()
                
                return redirect(url_for('login'))
                
        except Exception as e:
            flash(f'Database error: {str(e)}', 'error')
            return render_template('signup.html')
        
        finally:
            conn.close()
    
    return render_template('signup.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/dashboard' , methods=['GET' , 'POST'])
def dashboard():
    teacher_id = session.get('user_id')
    if not teacher_id:
        return redirect(url_for('login'))
    return render_template('dashboard.html')

@app.route("/api/dashboard")
def dash_board_api():
    teacher_id = session['user_id']
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT 
            c.course_title AS subject,
            p.section,
            cr.room_name AS location,
            p.day,
            p.period_id,
            p.period_span,
            c.course_id,
            b.batch
        FROM 
            routine_course_teachers rct
        JOIN courses c ON rct.course_id = c.course_id
        JOIN periods p ON p.routine_id = rct.routine_id AND p.course_id = rct.course_id
        JOIN classrooms cr ON p.room_id = cr.room_id
        JOIN routines r ON r.routine_id = p.routine_id
        JOIN batches b ON r.batch_id = b.batch_id
        WHERE 
            rct.teacher_id = %s
        ORDER BY 
            p.day, p.period_id;

        """, (teacher_id,))
        rows = cursor.fetchall()

    day_map = {'SAT': 0, 'SUN': 1, 'MON': 2, 'TUE': 3, 'WED': 4, 'THU': 5, 'FRI': 6}
    time_slots = [
        {"period": 1, "start": "8:10", "end": "9:00"},
        {"period": 2, "start": "9:00", "end": "9:50"},
        {"period": 3, "start": "9:50", "end": "10:40"},
        {"period": 4, "start": "11:00", "end": "11:50"},
        {"period": 5, "start": "11:50", "end": "12:40"},
        {"period": 6, "start": "12:40", "end": "1:30"},
        {"period": 7, "start": "2:30", "end": "3:20"},
        {"period": 8, "start": "3:20", "end": "4:10"},
        {"period": 9, "start": "4:10", "end": "5:00"},
    ]

    import random
    schedule_list = []

    for row in rows:
        day_index = day_map[row['day']]
        period_id = row['period_id']
        span = row['period_span']

        start = time_slots[period_id - 1]['start']
        end_index = period_id - 1 + span - 1
        end = time_slots[end_index]['end'] if end_index < len(time_slots) else time_slots[-1]['end']

        start_hour = int(start.split(':')[0])
        start_meridiem = "AM" if start_hour < 12 else "PM"
        end_hour = int(end.split(':')[0])
        end_meridiem = "AM" if end_hour < 12 else "PM"

        schedule_list.append({
            "id": len(schedule_list) + 1,
            "subject": row['subject'],
            "section": row['section'],
            "location": row['location'],
            "grade": row['batch'],
            "color": random.choice(["purple", "blue", "amber", "green", "red"]),
            "days": [day_index],
            "startTime": start + " " + start_meridiem,
            "endTime": end + " " + end_meridiem,
        })

    return jsonify({"schedule_data": schedule_list})



@app.route('/manage_routines' , methods=['GET' , 'POST'])
def manage_routines():
    teacher_id = session.get('user_id')
    if not teacher_id:
        return {'error': 'Not logged in'}, 401
    
    return render_template("manage_routines.html")



@app.route('/api/manage_routines', methods=['GET' , 'POST'] )
def api_manage_routines():
    teacher_id = session.get('user_id')

    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT 
            r.routine_id,
            b.batch,
            b.level,
            b.term,
            r.active_status
        FROM course_coordinator_batches cb
        JOIN batches b ON cb.batch_id = b.batch_id
        JOIN routines r ON r.batch_id = b.batch_id
        WHERE cb.teacher_id = %s;

        """, (teacher_id,))
        rows = cursor.fetchall()
        
        cursor.execute("""
            SELECT * from routines
        """)
        rtts = cursor.fetchall()
        
    conn.close()
    
    print(rtts)
    print(rows)
    routine = []
    for row in rows:
        routine.append({
            'routine_id'    : row['routine_id'],          # can be None if no routine yet
            'batch'         : row['batch'],
            'level'         : row['level'],
            'term'          : row['term'],
            'active_status' : row['active_status']
        })
    
    return jsonify(routine)


@app.route('/teacher_assignment', methods=['GET', 'POST'])
def teacher_assignment():
    teacher_id = session.get('user_id')
    if not teacher_id:
        return redirect(url_for('login'))

    conn = get_db_connection()

    if request.is_json:
        data = request.get_json()
        print(data)
        
        routine_id = data.get("routine_id")
        if not routine_id:
            conn.close()
            return jsonify({ "status": "error", "error": "Missing routine_id" }), 400

        session['routine_id'] = routine_id

        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT b.level, b.term, b.batch
                FROM routines r
                JOIN batches b ON r.batch_id = b.batch_id
                WHERE r.routine_id = %s
            """, (routine_id,))
            row = cursor.fetchone()

        conn.close()

        if not row:
            return jsonify({ "status": "error", "error": "Routine not found" }), 404

        session['level'] = row['level']
        session['term'] = row['term']
        session['batch'] = row['batch']

        return jsonify({ "status": "success" })  # 👈 JS will receive this and redirect



    # ✅ If form is submitted to create a new routine
    if request.form:
        level = int(request.form.get('level'))
        term = int(request.form.get('term'))
        batch = int(request.form.get('batch'))
        stat = False

        session['level'] = level
        session['term'] = term
        session['batch'] = batch

        print("Routine Created" , level , term , batch)
        
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT batch_id FROM batches 
                WHERE level = %s AND term = %s AND batch = %s
            """, (level, term, batch))
            btt_id = cursor.fetchone()

            if not btt_id:
                conn.close()
                return "Batch not found", 404

            bt_id = btt_id['batch_id']
            cursor.execute("""
                INSERT INTO routines (batch_id, active_status)
                VALUES (%s, %s)
            """, (bt_id, stat))
            conn.commit()

            cursor.execute("""
                SELECT COUNT(*) AS total_routines FROM routines;          
            """)
            result = cursor.fetchone()
            session['routine_id'] = result['total_routines']
            
            print(session['routine_id'])

        conn.close()
        return render_template('teacher_assignment.html')

    # ✅ GET request (page load)
    conn.close()
    return render_template('teacher_assignment.html')



@app.route('/api/teacher_assignment' , methods=['GET' , 'POST'])
def api_teacher_assignment():
    
    level = session['level']
    term = session['term']
    routine_id = session['routine_id']
    
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT course_id, course_code, course_title, credit
            FROM courses
            WHERE level = %s AND term = %s
        """, (level, term))
        rows = cursor.fetchall()
        
        cursor.execute("""
            SELECT teacher_id, name
            FROM teachers
        """)
        teach = cursor.fetchall()
        
        cursor.execute("""
            SELECT rct.course_id, t.teacher_id AS id, t.name
            FROM routine_course_teachers rct
            JOIN teachers t ON t.teacher_id = rct.teacher_id
            WHERE rct.routine_id = %s and rct.course_id 
        """, (routine_id,))
        assignments = cursor.fetchall()
        
    conn.close()
    
        
    availableCourses = []
    for row in rows:
        availableCourses.append({
            'course_id' : row['course_id'] ,
            'course_code' : row['course_code'] ,
            'course_title': row['course_title'],
            'credit' : row['credit'],
        })
        
    availableTeachers = []
    for row in teach:
        availableTeachers.append({
            'id' : row['teacher_id'] ,
            'name' : row['name']
        })

    
    
    return jsonify({
        'availableCourses': availableCourses,
        'availableTeachers': availableTeachers,
        'assignments': assignments
    })


@app.route('/edit_routine' , methods=['GET' , 'POST'])
def edit_routine():
    
    teacher_id = session.get('user_id')
    if not teacher_id:
        return redirect(url_for('login'))
    
    if request.args:
        session['routine_id'] = request.args.get('routine_id', type=int)
        
    return render_template('edit_routine.html')



@app.route('/api/edit_routine', methods=['GET' , 'POST'])
def api_edit_routine():
    
    routine_id = session['routine_id']
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT b.level, b.term, b.batch
            FROM routines r
            JOIN batches b ON r.batch_id = b.batch_id
            WHERE r.routine_id = %s
        """,(routine_id,))
        routine_data = cursor.fetchone()
        
    level = routine_data['level']
    term = routine_data['term']
    
    
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT course_id, course_code, course_title, credit , is_sessional
            FROM courses
            WHERE level = %s AND term = %s
        """, (level, term))
        all_course = cursor.fetchall()
        
        cursor.execute("""
            SELECT 
            p.course_id,
            c.course_code,
            p.period_id,
            p.period_span,
            p.day,
            p.room_id,
            r.room_name,
            c.is_sessional
            FROM periods p
            JOIN courses c ON p.course_id = c.course_id
            JOIN classrooms r ON p.room_id = r.room_id
            WHERE p.routine_id = %s and p.section = "A"
            ORDER BY p.day, p.period_id

        """, (routine_id,))
        all_periods_section_A = cursor.fetchall()

   
        cursor.execute("""
            SELECT 
            p.course_id,
            c.course_code,
            p.period_id,
            p.period_span,
            p.day,
            p.room_id,
            r.room_name,
            c.is_sessional
            FROM periods p
            JOIN courses c ON p.course_id = c.course_id
            JOIN classrooms r ON p.room_id = r.room_id
            WHERE p.routine_id = %s and p.section = "B"
            ORDER BY p.day, p.period_id;

        """, (routine_id,))
        all_periods_section_B = cursor.fetchall()
        
        
        cursor.execute("""       
            SELECT 
            c.course_id,
            cl.room_id,
            cl.room_name
            FROM courses c
            JOIN corresponding_classrooms cc ON c.course_id = cc.course_id
            JOIN classrooms cl ON cc.room_id = cl.room_id
            WHERE c.level = %s AND c.term = %s;

        """, (level , term,))
        all_availablerooms = cursor.fetchall()

    
    conn.close()
    
        
    availableCourses = []
    for row in all_course:
        availableCourses.append({
            'course_id' : row['course_id'] ,
            'course_code' : row['course_code'] ,
            'course_title': row['course_title'],
            'credit' : row['credit'],
            'is_sessional': row['is_sessional']
        })
        
    
    corresponding_lab_rooms = []
    for row in all_availablerooms:
        corresponding_lab_rooms.append({
            'course_id' : row['course_id'] , 
            'room_id' : row['room_id'] ,
            'room_name' : row['room_name']
        })
        
    
    routineSectionA = []
    routineSectionB = []
    
    for row in all_periods_section_A:
        routineSectionA.append({
            'course_id' : row['course_id'],
            'course_code' : row['course_code'],
            'period_id': row['period_id'],
            'day' : row['day'],
            'period_span': row['period_span'],
            'room_id' : row['room_id'],
            'room_name' :  row['room_name'],
            'is_sessional' : row['is_sessional']
        })
        
   
        
    for row in all_periods_section_B:
        routineSectionB.append({
            'course_id' : row['course_id'],
            'course_code' : row['course_code'],
            'period_id': row['period_id'],
            'period_span': row['period_span'],
            'day' : row['day'],
            'room_id' : row['room_id'],
            'room_name' :  row['room_name'],
            'is_sessional' : row['is_sessional']
        })
    
    return jsonify({
        'routine_id': routine_id,
        'availableCourses': availableCourses,
        'corresponding_lab_rooms': corresponding_lab_rooms,
        'routineSectionA': routineSectionA,
        'routineSectionB': routineSectionB
    })

    

    
    
@app.route('/view_routine', methods=['GET' , 'POST'])
def view_routine():
    teacher_id = session.get('user_id')
    if not teacher_id:
        return redirect(url_for('login'))
    
    session['routine_id'] = request.args.get('routine_id', type=int)
    return render_template('routine_view_page.html')



@app.route('/api/view_routine' , methods=['GET' , 'POST'])
def api_view_routine():
    
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT 
            p.course_id,
            c.course_code,
            c.course_title,
            p.period_id,
            p.period_span,
            p.day,
            p.room_id,
            r.room_name,
            c.is_sessional
            FROM periods p
            JOIN courses c ON p.course_id = c.course_id
            JOIN classrooms r ON p.room_id = r.room_id
            WHERE p.routine_id = %s and p.section = "A"
            ORDER BY p.day, p.period_id

        """, (session['routine_id'],))
        all_periods_section_A = cursor.fetchall()

   
        cursor.execute("""
            SELECT 
            p.course_id,
            c.course_code,
            c.course_title,
            p.period_id,
            p.period_span,
            p.day,
            p.room_id,
            r.room_name,
            c.is_sessional
            FROM periods p
            JOIN courses c ON p.course_id = c.course_id
            JOIN classrooms r ON p.room_id = r.room_id
            WHERE p.routine_id = %s and p.section = "B"
            ORDER BY p.day, p.period_id

        """, (session['routine_id'],))
        all_periods_section_B = cursor.fetchall()
        
        
        cursor.execute("""
            SELECT course_id , c.course_code, c.course_title
            FROM routines r
            JOIN batches b ON r.batch_id = b.batch_id
            JOIN courses c ON c.level = b.level AND c.term = b.term
            WHERE r.routine_id = %s;

        """, (session['routine_id'],))
        all_courses = cursor.fetchall()
    conn.close()
    
    routineSectionA = []
    routineSectionB = []
    
    for row in all_periods_section_A:
        routineSectionA.append({
            'course_id' : row['course_id'],
            'course_code' : row['course_code'],
            'course_title' : row['course_title'],
            'period_id': row['period_id'],
            'day' : row['day'],
            'period_span': row['period_span'],
            'room_id' : row['room_id'],
            'room_name' :  row['room_name'],
            'is_sessional' : row['is_sessional']
        })
        
   
        
    for row in all_periods_section_B:
        routineSectionB.append({
            'course_id' : row['course_id'],
            'course_code' : row['course_code'],
            'course_title' : row['course_title'],
            'period_id': row['period_id'],
            'period_span': row['period_span'],
            'day' : row['day'],
            'room_id' : row['room_id'],
            'room_name' :  row['room_name'],
            'is_sessional' : row['is_sessional']
        })
    

    
    courses = {}
    for course in all_courses:
        courses[course['course_id']] = {
            'code' : course['course_code'],
            'name' : course['course_title']
        }
    
    print(courses)
    
    mock_data = {
        'sectionA': {},
        'sectionB': {}
    }

    # Process Section A
    for period in routineSectionA:
        day = period['day']
        period_id = period['period_id']
        
        if day not in mock_data['sectionA']:
            mock_data['sectionA'][day] = {}
        
        mock_data['sectionA'][day][period_id] = {
            'courseId': period['course_code'].lower(),
            'section': period['course_code'],
            'periodSpan': period['period_span'],
            'room_id': period['room_id'],  # Convert to string to match mock format
            'room_name': period['room_name'],
            'is_sessional': period['is_sessional']
        }

    # Process Section B
    for period in routineSectionB:
        day = period['day']
        period_id = period['period_id']
        
        if day not in mock_data['sectionB']:
            mock_data['sectionB'][day] = {}
        
        mock_data['sectionB'][day][period_id] = {
            'courseId': period['course_code'].lower(),
            'section': period['course_code'],
            'periodSpan': period['period_span'],
            'room_id': str(period['room_id']),  # Convert to string to match mock format
            'room_name': period['room_name'],
            'is_sessional': period['is_sessional']
        }

    
    print(courses)
    print(mock_data)
    
    return jsonify({
        'routine_id': session['routine_id'],
        'routine_data': mock_data,
        'courses' : courses
    })
    




@app.route('/api/save_course_assignment', methods=['GET' , 'POST'])
def save_course_assignment():
    data = request.get_json()
    if not data:
        return jsonify({ "error": "Missing JSON body" }), 400

    routine_id = int(data['routine_id'])
    course_id = int(data['course_id'])
    period_id = int(data['period_id'])        # first period
    period_span = int(data.get('period_span', 1))
    section = data['section']
    day = data['day']
    room_id = int(data.get('room_id', 1))  # Default room if not provided
    
    if not all([routine_id, course_id, period_id, period_span, section, day, room_id]):
        return jsonify({ "error": "Missing data" }), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({ "error": "Database connection error" }), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO periods 
                (period_id, period_span, routine_id, course_id, room_id, day, section)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (period_id, period_span, routine_id, course_id, room_id, day, section))
            conn.commit()
        return jsonify({ "status": "success" }), 201

    except pymysql.err.IntegrityError as e:
        return jsonify({ "error": "Conflict: " + str(e) }), 409
    except Exception as e:
        return jsonify({ "error": "Internal server error: " + str(e) }), 500
    finally:
        conn.close()



@app.route('/api/remove_course_assignment' , methods=['GET' , 'POST'])
def remove_course_assignment():
    
    data = request.get_json()
    routine_id = int(data['routine_id'])
    day = data['day']
    period = int(data['period_id'])
    section = data['section']
    
    print(data)
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            DELETE FROM periods
            WHERE routine_id = %s AND section = %s AND day = %s AND period_id = %s
        """,(routine_id , section , day , period))
        conn.commit()
    conn.close()

    return jsonify({"status": "success"}), 201



@app.route('/api/assign_teacher_to_course', methods=['GET' , 'POST'])
def assign_teacher_to_course():
    try:
        data = request.get_json()
        if not data:
            return jsonify({ "error": "Missing JSON body" }), 400

        teacher_id = data.get("teacher_id")
        course_id = data.get("course_id")
        routine_id = session.get("routine_id")

        if not all([teacher_id, course_id, routine_id]):
            return jsonify({ "error": "Missing data" }), 400

        conn = get_db_connection()
        with conn.cursor() as cursor:
            try:
                cursor.execute("""
                    INSERT INTO routine_course_teachers (routine_id, course_id, teacher_id)
                    VALUES (%s, %s, %s)
                """, (routine_id, course_id, teacher_id))
                conn.commit()
            except pymysql.err.IntegrityError:
                return jsonify({ "error": "Teacher already assigned to this course." }), 409

        return jsonify({ "status": "success" }), 201

    except Exception as e:
        print("🔥 ERROR:", e)
        return jsonify({ "error": "Internal server error" }), 500


    
@app.route('/api/remove_teacher_assignment' , methods=['GET' , 'POST'])
def remove_teacher_assignment():
    
    data = request.get_json()
    teacher_id = data.get("teacher_id")
    course_id = data.get("course_id")
    routine_id = session['routine_id']
    
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            DELETE FROM routine_course_teachers
            WHERE routine_id = %s AND course_id = %s AND teacher_id = %s
        """,(routine_id , course_id , teacher_id))
    conn.commit()
    conn.close()

    return jsonify({"status": "success"}), 201



@app.route('/api/delete_routine' , methods=['GET' , 'POST'])
def delete_routine():
    
    routine_id = request.get_json().get('routine_id')
    
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            DELETE FROM periods WHERE routine_id = %s
        """,(routine_id,))
        cursor.execute("""
            DELETE FROM routine_course_teachers WHERE routine_id = %s;
        """,(routine_id,))
        cursor.execute("""
            DELETE FROM routines WHERE routine_id = %s;
        """,(routine_id,))
        conn.commit()
    conn.close()

    return jsonify({"status": "success"}), 201


    
@app.route('/api/save_teacher_assignments', methods=['POST'])
def save_teacher_assignments():
    data = request.get_json()
    routine_id = session['routine_id']
    print(routine_id)
    if not data:
        return jsonify({"status": "error", "error": "No data received"}), 400
    
    try:
        # Example: data is a list of course assignments
        for course in data:
            course_id = course['course_id']
            classroom = course.get('classroom', '')
            teachers = course.get('teachers', [])
            
            # Save classroom info
            # Assuming you have a table to store classrooms assigned to courses for the routine
            # You might want to update a 'classroom' column in a routine_course table or similar
            
            # Save teacher assignments - e.g. in routine_course_teachers
            # For simplicity, delete existing and insert new assignments
            
            # You will need the routine_id for context; 
            # either pass it in request or get from session
            
            # Here's a pseudocode example:
            # db.execute("DELETE FROM routine_course_teachers WHERE routine_id=%s AND course_id=%s", (routine_id, course_id))
            # for teacher_id in teachers:
            #     db.execute("INSERT INTO routine_course_teachers (routine_id, course_id, teacher_id) VALUES (%s, %s, %s)", (routine_id, course_id, teacher_id))
            
        # Commit transaction, etc.
        return jsonify({"status": "success", "routine_id": routine_id})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500





if __name__ == '__main__':
    app.run(debug=True)


