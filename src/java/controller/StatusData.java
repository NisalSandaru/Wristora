package controller;

import com.google.gson.Gson;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.OrderStatus;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

@WebServlet(name = "StatusData", urlPatterns = {"/StatusData"})
public class StatusData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        Criteria c = s.createCriteria(OrderStatus.class);
        List<OrderStatus> statusList = c.list();

        Gson gson = new Gson();
        String toJson = gson.toJson(statusList);
        resp.setContentType("application/json");
        resp.getWriter().write(toJson);
        s.close();
    }
}
