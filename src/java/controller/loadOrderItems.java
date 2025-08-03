package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Orders;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "loadOrderItems", urlPatterns = {"/loadOrderItems"})
public class loadOrderItems extends HttpServlet {

    private static final int MAX_RESULT = 7;
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        User user = (User) req.getSession().getAttribute("user");
        if (user != null) { //db cart
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Criteria c1 = s.createCriteria(Orders.class);
            c1.add(Restrictions.eq("user", user));
            c1.setMaxResults(loadOrderItems.MAX_RESULT);
            c1.addOrder(Order.desc("id"));
            List<Orders> orderList = c1.list();
            if (orderList.isEmpty()) {
                responseObject.addProperty("message", "No Orders");
            } else {
                
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Order items successfully loaded");
                responseObject.add("orderList", gson.toJsonTree(orderList));
            }
        } else {
            responseObject.addProperty("message", "Please log in.");
        }
        resp.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        resp.getWriter().write(toJson);
    }
}
