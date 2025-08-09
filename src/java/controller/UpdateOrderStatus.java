package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderStatus;
import hibernate.Orders;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

@WebServlet(name = "UpdateOrderStatus", urlPatterns = {"/UpdateOrderStatus"})
public class UpdateOrderStatus extends HttpServlet {

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject signIn = gson.fromJson(req.getReader(), JsonObject.class);

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        String statusId = signIn.get("statusId").getAsString();
        String orderId = signIn.get("orderId").getAsString();

        if (!Util.isInteger(statusId)) {
            responseObject.addProperty("message", "Invalid statusId!");
        } else if ("0".equals(statusId)) {
            responseObject.addProperty("message", "Select status!");
        } else if (!Util.isInteger(orderId)) {
            responseObject.addProperty("message", "Invalid orderId!");
        } else {

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            HttpSession ses = req.getSession();

            try {
                // Fetch the order by ID
                if (ses.getAttribute("admin") != null) {
                    s.beginTransaction();

                    Orders order = (Orders) s.get(Orders.class, Integer.parseInt(orderId));
                    if (order == null) {
                        responseObject.addProperty("message", "Order not found");
                    } else {
                        // Fetch the new OrderStatus by statusId
                        OrderStatus newStatus = (OrderStatus) s.get(OrderStatus.class, Integer.parseInt(statusId));
                        if (newStatus == null) {
                            responseObject.addProperty("message", "Invalid Order Status");
                        } else {
                            // Update the order status
                            order.setOrderStatus(newStatus);
                            s.update(order);
                            s.getTransaction().commit();

                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "Order status updated successfully");
                        }
                    }
                } else {
                    responseObject.addProperty("message", "login");
                }
            } catch (Exception e) {
                if (s.getTransaction().isActive()) {
                    s.getTransaction().rollback();
                }
                e.printStackTrace();
                responseObject.addProperty("message", "Error updating order status");
            } finally {
                s.close();
            }
        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(responseObject));
    }

}
