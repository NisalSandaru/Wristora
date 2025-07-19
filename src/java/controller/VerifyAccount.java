/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "VerifyAccount", urlPatterns = {"/VerifyAccount"})
public class VerifyAccount extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        HttpSession ses = req.getSession();
        
        if (ses.getAttribute("email") == null) {
            responseObject.addProperty("message", "1");//email not found
        } else {
            String email = ses.getAttribute("email").toString();

            JsonObject verification = gson.fromJson(req.getReader(), JsonObject.class);

            String verificationCode = verification.get("verificationCode").getAsString();

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            Criteria c1 = s.createCriteria(User.class);

            Criterion ctr1 = Restrictions.eq("email", email);
            Criterion ctr2 = Restrictions.eq("verification", verificationCode);

            c1.add(ctr1);
            c1.add(ctr2);

            if (c1.list().isEmpty()) {
                responseObject.addProperty("msessage", "Invalid verification code");
            } else {
                User u1 = (User) c1.list().get(0);
                u1.setVerification("Verified");

                s.update(u1);
                s.beginTransaction().commit();

                //store user in the session
                ses.setAttribute("user", u1);
                //store user in the session
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "verification successful");
            }
            s.close();
        }
        String responseText = gson.toJson(responseObject);
        resp.setContentType("application/json");
        resp.getWriter().write(responseText);
        
    }

}
